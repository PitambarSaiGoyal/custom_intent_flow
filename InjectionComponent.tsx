'use client'
import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import type { ViewStateDispatch, ViewStateRootState } from "./store"
import {
  setFlagsTrue,
  setFullIFConfig,
  setInjectionVisibilityConfig,
  type FullIFConfig,
  type InjectionComponentContent,
  type InjectionVisibilityConfig,
} from "./viewStateSlice"

export type InjectionComponentProps = {
  bottomCardContent?: InjectionComponentContent
  centeredModalContent?: InjectionComponentContent
}

/**
 * Single line comment describing injection component behavior
 */
const FALLBACK_BOTTOM_CARD: InjectionComponentContent = {
  content: "Discover personalized offers tailored to your goals.",
  imageUrl: "",
  link: "/",
}

const TESTING = true;

const FALLBACK_CENTERED_MODAL: InjectionComponentContent = {
  content: "Smart banking, curated insights, unified journeys.",
  imageUrl: "",
  link: "/",
}

const InjectionComponent: React.FC<InjectionComponentProps> = ({
  bottomCardContent,
  centeredModalContent,
}) => {
  const viewState = useSelector((state: ViewStateRootState) => state.viewState)
  const dispatch = useDispatch<ViewStateDispatch>()
  const [pollingError, setPollingError] = useState<string | null>(null)
  const [bottomCardDismissed, setBottomCardDismissed] = useState(true)
  const [centeredModalDismissed, setCenteredModalDismissed] = useState(true)
  const [componentLink, setComponentLink] = useState('')
  const [innerContent, setInnerContent] = useState('')
  const fullIFConfig = viewState.fullIFConfig

  const resolvedBottomCardContent =
    fullIFConfig?.componentProps?.bottomCard ??
    bottomCardContent ??
    viewState.componentProps.bottomCard ??
    FALLBACK_BOTTOM_CARD

  const resolvedCenteredModalContent =
    fullIFConfig?.componentProps?.centeredModal ??
    centeredModalContent ??
    viewState.componentProps.centeredModal ??
    FALLBACK_CENTERED_MODAL
  

  const showBottomCard = !bottomCardDismissed;//shouldDisplayBottomCard && !bottomCardDismissed
  const showCentralModal = !centeredModalDismissed;//shouldDisplayCenteredModal && !centeredModalDismissed

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ifState = localStorage.getItem('ifState')
      if (ifState === null) {
        localStorage.setItem('ifState', JSON.stringify([]))
      }
    }
  }, [])

  useEffect(() => {
    console.log("[InjectionComponent] fetching enriched config on mount")

    const fetchLatestConfig = async () => {
      try {
        let response;
        if(TESTING){
          response = {
              "title": "Savings Account Explorer",
              "flow_steps": [
                {
                  "id": "explored_savings",
                  "event": "click",
                  "element": "SavingsZero balance accounts",
                  "set_flag": "exploredSavings"
                },
                {
                  "id": "viewed_calculator",
                  "event": "Text Hover",
                  "element": "DIV | 6.5% p.a. | /",
                  "set_flag": "viewedCalculator"
                }
              ],
              "pattern_id": "ec4fafbd-75ae-48b4-a564-8dcabbec0399",
              "flow_components": {
                "bottomCard": {
                  "link": "/smartassist/insights",
                  "type": "bottomCard",
                  "message": "You might want to check out our SavingsZero balance accounts with instant benefits.",
                  "imageUrl": "https://cdn.example.com/images/telemetry-modal.png"
                }
              },
              "flow_uiMappings": [
                {
                  "flags": [
                    "exploredSavings",
                    "viewedCalculator"
                  ],
                  "componentId": "bottomCard"
                }
              ],
              "similarity_score": 0.074775256,
              "bottomCardMessage": "Explore our SavingsZero balance accounts for instant benefits and easy savings!",
              "centredModalMessage": "Unlock the potential of your savings with our SavingsZero balance accounts. Enjoy instant benefits, no minimum balance requirements, and a competitive interest rate of 6.5% p.a. Start maximizing your savings today and watch your money grow effortlessly!"
            }
        }
        else response = await fetch("/api/view-state/poll", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          throw new Error(
            `[InjectionComponent] GET current config failed with status ${response.status}: ${JSON.stringify(body)}`,
          )
        }

        const data: FullIFConfig = TESTING ? response : await response.json()
        console.log("[InjectionComponent] full IF config", data)
        dispatch(setFullIFConfig(data))

        const enrichedConfig = data

        const groupedFlags: InjectionVisibilityConfig = {
          bottomCard: [],
          centeredModal: [],
        }

        const mappingEntries = Object.values(enrichedConfig.eventFlagMapping ?? {})
        for (let i = 0; i < mappingEntries.length; i++) {
          const entry = mappingEntries[i]
          if (!entry?.flags || entry.flags.length === 0) {
            continue
          }

          if (entry.componentContent === "bottomCard") {
            groupedFlags.bottomCard!.push(...entry.flags)
          } else if (entry.componentContent === "centeredModal") {
            groupedFlags.centeredModal!.push(...entry.flags)
          }
        }

        const normalizedConfig: InjectionVisibilityConfig = {
          bottomCard: groupedFlags.bottomCard && groupedFlags.bottomCard.length > 0 ? groupedFlags.bottomCard : undefined,
          centeredModal:
            groupedFlags.centeredModal && groupedFlags.centeredModal.length > 0 ? groupedFlags.centeredModal : undefined,
        }

        const config =
          normalizedConfig.bottomCard || normalizedConfig.centeredModal
            ? normalizedConfig
            : enrichedConfig.injectionConfig ?? {}

        console.log("[InjectionComponent] applying injection config from enriched config", {
          config,
        })

        dispatch(setInjectionVisibilityConfig(config))
        setPollingError(null)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.error("[InjectionComponent] GET current config failed", { error: message })
        setPollingError(message)
      }
    }

    void fetchLatestConfig()
  }, [dispatch])

  useEffect(() => {

    const pollLatestEvent = async () => {
      let response, randomNumber;
      if(TESTING){
        randomNumber = Math.floor(Math.random() * 100);
        response = randomNumber % 4 === 0 ? {event: 'Text Hover', element: 'DIV | 6.5% p.a. | /'} : {event: 'Click', element: 'DIV | 6.5% p.a. | /'};
      }
      else response = await fetch("/api/view-state/latest-event", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const eventResp: { urlPath: string; eventName: string } = TESTING ? response:await response.json()

      const flagsToSet: string[] = []
      const steps = fullIFConfig?.flowSteps ?? []
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        if (step.parentUIComp === eventResp.urlPath && step.action === eventResp.eventName) {
          const stepFlags = step.flag ?? step.flags ?? []
          flagsToSet.push(...stepFlags)
        }
      }

      if (flagsToSet.length > 0) {
        dispatch(setFlagsTrue(flagsToSet))
      }
    }

    const intervalId = setInterval(() => {
      void pollLatestEvent()
    }, 5000)

    void pollLatestEvent()

    return () => {
      clearInterval(intervalId)
    }
  }, [dispatch, fullIFConfig])

  useEffect(() => {
    const updateState = async () => {

      // Get sessionId from localStorage
      let sessionId = "sample_session"
      const umamiSessionData = localStorage.getItem('umamiSessionData')
      if (umamiSessionData !== null) {
        const parsed = typeof umamiSessionData === 'string' ? JSON.parse(umamiSessionData) : umamiSessionData
        if (parsed && typeof parsed === 'object' && 'sessionId' in parsed) {
          sessionId = parsed.sessionId as string
        }
      }

      // Get state from localStorage
      const ifStateStr = localStorage.getItem('ifState')
      let state: string[] = []
      if (ifStateStr !== null) {
        state = JSON.parse(ifStateStr)
      }

      // Make POST request
      const response = await fetch("https://vigilant-bassoon-x9qq6pvv5rqhp56w-8000.app.github.dev/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          state,
        }),
      })

      const responseData = await response.json()
      if (responseData.updatedState) {
        localStorage.setItem('ifState', JSON.stringify(responseData.updatedState))
      }
      if(responseData.components){
        setComponentLink(responseData.components.link)
        setInnerContent(responseData.components.innerContent)
        if(responseData.components.type == 'bottomCard')
          setBottomCardDismissed(false)
        else if(responseData.components.type == 'centeredModal')
          setCenteredModalDismissed(false)
      }
      
    }

    const intervalId = setInterval(() => {
      void updateState()
    }, 5000)

    void updateState()

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  

  return (
    <>
      {pollingError ? (
        <div className="fixed top-4 right-4 z-50 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 shadow-md">
          {pollingError}
        </div>
      ) : null}
      {!showBottomCard ? (
        <BottomCard
          contentProps={resolvedBottomCardContent}
          onClose={() => setBottomCardDismissed(true)}
        />
      ) : null}
      {showBottomCard ? (
        <BottomCardInnerHTML
          innerContent={ innerContent ? innerContent : '<b>TESTING!!!!</b>'}
          link={componentLink ? componentLink : '/'}
          onClose={() => setBottomCardDismissed(true)}
        />
      ) : null}
      {showCentralModal ? (
        <CenteredModal
          contentProps={resolvedCenteredModalContent}
          onClose={() => setCenteredModalDismissed(true)}
        />
      ) : null}
    </>
  )
}

export default InjectionComponent

function BottomCard({
  contentProps,
  onClose,
}: {
  contentProps: InjectionComponentContent
  onClose: () => void
}) {
  if(!contentProps) {return (<></>)}
  const { imageUrl, link, content } = contentProps;
  return (
    <div className="fixed bottom-6 left-6 z-50 shadow-lg rounded-xl bg-white/95 backdrop-blur-md border border-gray-200 max-w-sm">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-2 right-2 rounded-full bg-white/90 p-1 text-xs text-slate-500 shadow hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Close bottom card"
      >
        ×
      </button>
      <Link href={link} className="flex items-center gap-3 p-4" target="_blank" rel="noopener noreferrer">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-slate-100 shadow-inner">
          <Image src={imageUrl} alt={content} fill sizes="48px" className="object-cover" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">Hi There!</p>
          <p className="text-xs text-slate-600">{content}</p>
          <span className="mt-2 inline-flex text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            Discover tailored offers →
          </span>
        </div>
      </Link>
    </div>
  )
}

function BottomCardInnerHTML({
  innerContent,
  link,
  onClose,
}: {
  innerContent: string
  link: string
  onClose: () => void
}) {
  return (
    <div className="fixed bottom-6 left-6 z-50 shadow-lg rounded-xl bg-white/95 backdrop-blur-md border border-gray-200 max-w-sm">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-2 right-2 rounded-full bg-white/90 p-1 text-xs text-slate-500 shadow hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Close bottom card"
      >
        ×
      </button>
      <Link href={link} className="flex items-center gap-3 p-4" target="_blank" rel="noopener noreferrer">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">Hi There!</p><br/>
          <div 
              className="text-xs text-slate-600"
              dangerouslySetInnerHTML={{ __html: innerContent }}
            /><br/>
          <span className="mt-2 inline-flex text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            Learn More →
          </span>
        </div>
      </Link>
    </div>
  )
}

function CenteredModal({
  contentProps,
  onClose,
}: {
  contentProps: InjectionComponentContent
  onClose: () => void
}) {
  const { imageUrl, link, content } = contentProps
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto shadow-2xl rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200 max-w-md w-full mx-4 p-8 text-center space-y-4 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full bg-white/90 px-2 text-sm text-slate-500 shadow hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Close modal"
        >
          ×
        </button>
        <div className="inline-flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
          XeraBank Insights
        </div>
        <div className="relative h-16 w-16 mx-auto overflow-hidden rounded-full border border-gray-100 shadow-inner">
          <Image src={imageUrl} alt={`${content} modal`} fill sizes="64px" className="object-cover" />
        </div>
        <p className="text-lg font-semibold text-slate-900">{content}</p>
        <p className="text-sm text-slate-600">
          Stay ahead with personalized financial recommendations, curated dashboards, and real-time journey tracking tailored to your goals.
        </p>
        <div className="flex flex-col items-center gap-2 text-xs text-slate-500">
          <span>• Unified view across savings, credit, and investments</span>
          <span>• Instant insights powered by SmartAssist AI</span>
          <span>• Dedicated advisor channel for premium members</span>
        </div>
        <Link
          href={link}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore Smart Banking
        </Link>
      </div>
    </div>
  )
}

