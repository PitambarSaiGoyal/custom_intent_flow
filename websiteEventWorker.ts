'use strict'

import { Client } from 'pg'
import { viewStateStore } from './store'
import { setFlagsTrue } from './viewStateSlice'

type WebsiteEventPayload = {
  urlPath: string
  eventName: string
  createdAt: string
}

type EnrichedConfigPayload = {
  sessionId: string
  eventName: string
  createdAt: string
  enrichedConfig: unknown
}

type FlowStep = {
  parentUIComp?: string
  action?: string
  event?: string
  flags: string[]
}

const DEFAULT_POLL_INTERVAL_MS = 5000
const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://kaviya:Kaviya%24531@10.100.21.89:5432/smart_assist_public_demo'

const pollIntervalMs = Number.parseInt(
  process.env.WEBSITE_EVENT_POLL_INTERVAL_MS ?? '',
  10,
)

const resolvedPollInterval =
  Number.isNaN(pollIntervalMs) || pollIntervalMs <= 0
    ? DEFAULT_POLL_INTERVAL_MS
    : pollIntervalMs

let client: Client | null = null
let lastWebsiteEventTimestamp: string | null = null
let lastEnrichedConfigTimestamp: string | null = null
let pollHandle: NodeJS.Timeout | null = null
let localFlowSteps: FlowStep[] = []

async function ensureClient(): Promise<Client> {
  if (!connectionString) {
    throw new Error(
      '[websiteEventWorker] DATABASE_URL is not defined. Cannot query database.',
    )
  }

  if (client) {
    return client
  }

  client = new Client({
    connectionString,
    connectionTimeoutMillis: 5000,
  })

  client.on('error', (error) => {
    console.error('[websiteEventWorker] Client error encountered', {
      error: error instanceof Error ? error.message : String(error),
    })
    void reconnect()
  })

  await client.connect()
  console.log('[websiteEventWorker] Connected to PostgreSQL')
  return client
}

async function reconnect(): Promise<void> {
  if (client) {
    try {
      await client.end()
    } catch (endError) {
      console.error('[websiteEventWorker] Failed to close client during reconnect', {
        error: endError instanceof Error ? endError.message : String(endError),
      })
    }
    client = null
  }

  try {
    await ensureClient()
    console.log('[websiteEventWorker] Reconnected to PostgreSQL')
  } catch (error) {
    console.error('[websiteEventWorker] Reconnection attempt failed', {
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

async function loadInitialCursor(): Promise<void> {
  try {
    const dbClient = await ensureClient()

    const websiteEventResult = await dbClient.query<{
      url_path: string
      event_name: string
      created_at: string
    }>(
      `SELECT url_path, event_name, created_at
       FROM public.website_event
       ORDER BY created_at DESC
       LIMIT 1`,
    )

    if (websiteEventResult.rows.length > 0) {
      const row = websiteEventResult.rows[0]
      lastWebsiteEventTimestamp = row.created_at
      console.log('[websiteEventWorker] Initial website_event cursor set', {
        urlPath: row.url_path,
        eventName: row.event_name,
        createdAt: row.created_at,
      })
    } else {
      lastWebsiteEventTimestamp = new Date(0).toISOString()
      console.log('[websiteEventWorker] No existing website_event rows found')
    }

    const enrichedConfigResult = await dbClient.query<{ created_at: string }>(
      `SELECT created_at
       FROM public.llm_enriched_config
       ORDER BY created_at DESC
       LIMIT 1`,
    )

    if (enrichedConfigResult.rows.length > 0) {
      lastEnrichedConfigTimestamp = enrichedConfigResult.rows[0].created_at
      console.log('[websiteEventWorker] Initial llm_enriched_config cursor set', {
        createdAt: lastEnrichedConfigTimestamp,
      })
    } else {
      lastEnrichedConfigTimestamp = new Date(0).toISOString()
      console.log('[websiteEventWorker] No existing llm_enriched_config rows found')
    }
  } catch (error) {
    console.error('[websiteEventWorker] Failed to load initial cursors', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

// Poll website_event table and toggle Redux flags for matching flow steps
async function pollOnce(): Promise<WebsiteEventPayload[]> {
  try {
    const dbClient = await ensureClient()
    const baselineTimestamp = lastWebsiteEventTimestamp ?? new Date(0).toISOString()

    const result = await dbClient.query<{
      url_path: string
      event_name: string
      created_at: string
    }>(
      `SELECT url_path, event_name, created_at
       FROM public.website_event
       WHERE created_at > $1
       ORDER BY created_at ASC`,
      [baselineTimestamp],
    )

    if (result.rows.length === 0) {
      return []
    }

    const payload: WebsiteEventPayload[] = result.rows.map((row) => ({
      urlPath: row.url_path,
      eventName: row.event_name,
      createdAt: row.created_at,
    }))

    lastWebsiteEventTimestamp =
      payload[payload.length - 1]?.createdAt ?? lastWebsiteEventTimestamp

    if (localFlowSteps.length > 0) {
      const flagsToSet = new Set<string>()
      const matchSummaries: Array<{
        urlPath: string
        eventName: string
        matchedBy: 'action' | 'event' | 'both'
        flags: string[]
      }> = []

      payload.forEach((row) => {
        localFlowSteps.forEach((step) => {
          const matchesParent = step.parentUIComp === row.urlPath
          const matchesAction = step.action === row.eventName
          const matchesEvent = step.event === row.eventName

          if (matchesParent && (matchesAction || matchesEvent)) {
            step.flags.forEach((flag) => flagsToSet.add(flag))
            const matchedBy: 'action' | 'event' | 'both' =
              matchesAction && matchesEvent
                ? 'both'
                : matchesAction
                  ? 'action'
                  : 'event'

            matchSummaries.push({
              urlPath: row.urlPath,
              eventName: row.eventName,
              matchedBy,
              flags: step.flags,
            })
          }
        })
      })

      if (flagsToSet.size > 0) {
        const flagsArray = Array.from(flagsToSet)
        console.log('[websiteEventWorker] Flow step matches detected, dispatching flags', {
          flags: flagsArray,
          matchSummaries,
        })
        viewStateStore.dispatch(setFlagsTrue(flagsArray))
      } else {
        console.log('[websiteEventWorker] Flow step comparison completed with no matches', {
          processedEvents: payload.length,
          trackedFlowSteps: localFlowSteps.length,
        })
      }
    }

    return payload
  } catch (error) {
    console.error('[websiteEventWorker] Polling error', {
      error: error instanceof Error ? error.message : String(error),
    })
    await reconnect()
    return []
  }
}

// Poll llm_enriched_config table and cache latest flow steps
async function pollEnrichedConfigOnce(): Promise<EnrichedConfigPayload[]> {
  try {
    const dbClient = await ensureClient()
    const baselineTimestamp = lastEnrichedConfigTimestamp ?? new Date(0).toISOString()

    const result = await dbClient.query<{
      session_id: string
      event_name: string
      created_at: string
      enriched_config: unknown
    }>(
      `SELECT session_id, event_name, created_at, enriched_config
       FROM public.llm_enriched_config
       WHERE created_at > $1
       ORDER BY created_at ASC`,
      [baselineTimestamp],
    )

    if (result.rows.length === 0) {
      return []
    }

    const payload: EnrichedConfigPayload[] = result.rows.map((row) => ({
      sessionId: row.session_id,
      eventName: row.event_name,
      createdAt: row.created_at,
      enrichedConfig: row.enriched_config,
    }))

    lastEnrichedConfigTimestamp =
      payload[payload.length - 1]?.createdAt ?? lastEnrichedConfigTimestamp

    const latestConfig = payload[payload.length - 1]
    let flowSteps: FlowStep[] = []
    const discardedSteps: Array<{
      parentUIComp?: string
      action?: string
      event?: string
    }> = []

    if (latestConfig) {
      try {
        const enrichedConfig =
          typeof latestConfig.enrichedConfig === 'string'
            ? JSON.parse(latestConfig.enrichedConfig)
            : latestConfig.enrichedConfig

        if (enrichedConfig && Array.isArray(enrichedConfig.flowSteps)) {
          flowSteps = enrichedConfig.flowSteps
            .map((step: Partial<FlowStep> & { flag?: unknown }) => {
              const combinedFlags = Array.isArray(step.flag)
                ? (step.flag as string[])
                : Array.isArray(step.flags)
                  ? step.flags
                  : []

              const normalizedFlags = combinedFlags.filter(
                (flag): flag is string => typeof flag === 'string' && flag.trim().length > 0,
              )

              const normalizedStep: FlowStep = {
                parentUIComp:
                  typeof step.parentUIComp === 'string' ? step.parentUIComp : undefined,
                action: typeof step.action === 'string' ? step.action : undefined,
                event:
                  typeof step.event === 'string'
                    ? step.event
                    : typeof step.action === 'string'
                      ? step.action
                      : undefined,
                flags: normalizedFlags,
              }

              if (!normalizedStep.parentUIComp || normalizedStep.flags.length === 0) {
                discardedSteps.push({
                  parentUIComp: normalizedStep.parentUIComp,
                  action: normalizedStep.action,
                  event: normalizedStep.event,
                })
                return null
              }

              return normalizedStep
            })
            .filter((step: FlowStep | null): step is FlowStep => step !== null)
        }
      } catch (parseError) {
        console.error('[websiteEventWorker] Failed to parse enriched_config flowSteps', parseError)
      }
    }

    localFlowSteps = flowSteps
    const sampleSteps = localFlowSteps.slice(0, 3).map((step) => ({
      parentUIComp: step.parentUIComp,
      action: step.action,
      event: step.event,
      flags: step.flags,
    }))

    console.log('[websiteEventWorker] Flow step cache refreshed for comparisons', {
      totalSteps: localFlowSteps.length,
      discardedStepsCount: discardedSteps.length,
      discardedSample: discardedSteps.slice(0, 3),
      sampleSteps,
    })

    return payload
  } catch (error) {
    console.error('[websiteEventWorker] Enriched config polling error', {
      error: error instanceof Error ? error.message : String(error),
    })
    await reconnect()
    return []
  }
}

async function start(): Promise<void> {
  if (!connectionString) {
    throw new Error(
      '[websiteEventWorker] DATABASE_URL is not defined. Cannot start worker.',
    )
  }

  await ensureClient()
  await loadInitialCursor()

  console.log('[websiteEventWorker] Starting poll loop', {
    intervalMs: resolvedPollInterval,
  })

  pollHandle = setInterval(() => {
    void pollOnce()
    void pollEnrichedConfigOnce()
  }, resolvedPollInterval)

  await pollOnce()
  await pollEnrichedConfigOnce()
}

async function shutdown(code = 0): Promise<void> {
  if (pollHandle) {
    clearInterval(pollHandle)
    pollHandle = null
  }

  if (client) {
    try {
      await client.end()
      console.log('[websiteEventWorker] PostgreSQL connection closed')
    } catch (error) {
      console.error('[websiteEventWorker] Failed to close PostgreSQL connection', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  process.exit(code)
}

process.on('SIGINT', () => {
  console.log('[websiteEventWorker] Received SIGINT, shutting down...')
  void shutdown(0)
})

process.on('SIGTERM', () => {
  console.log('[websiteEventWorker] Received SIGTERM, shutting down...')
  void shutdown(0)
})

process.on('uncaughtException', (error) => {
  console.error('[websiteEventWorker] Uncaught exception', error)
  void shutdown(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('[websiteEventWorker] Unhandled rejection', reason)
  void shutdown(1)
})

void start().catch(async (error) => {
  console.error('[websiteEventWorker] Fatal startup error', {
    error: error instanceof Error ? error.message : String(error),
  })
  await shutdown(1)
})

