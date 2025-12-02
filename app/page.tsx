'use client'

import React from "react"
import InjectionComponent from "../InjectionComponent"
import ViewStateProvider from "../ViewStateProvider"

export default function HomePage() {
  return (
    <ViewStateProvider>
      <main className="relative min-h-screen bg-slate-950 text-slate-50">
        {/* Ambient background accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -left-32 top-[-8rem] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute right-[-6rem] top-40 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute bottom-[-10rem] left-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-800/60 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
          <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.22),transparent_55%),radial-gradient(circle_at_bottom,_rgba(45,212,191,0.16),transparent_55%)] opacity-90" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-center lg:py-24">
            <div className="space-y-6 lg:w-1/2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
                Welcome to XeraBank
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Modern banking for{" "}
                <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                  your
                </span>{" "}
                every day.
              </h1>
              <p className="max-w-xl text-sm text-slate-300 sm:text-base">
                Manage savings, credit, and investments in one intuitive dashboard. Real-time insights,
                instant alerts, and journeys tailored to your financial goals.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="group inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 transition hover:scale-[1.02] hover:shadow-emerald-400/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
                  Open an account
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </button>
                <button className="rounded-md border border-slate-600/80 bg-slate-900/40 px-5 py-2.5 text-sm font-medium text-slate-100 shadow-sm transition hover:border-indigo-400/70 hover:bg-slate-900/80 hover:text-white">
                  Explore products
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                FDIC insured • 24/7 support • No hidden fees
              </p>
            </div>

            <div className="lg:w-1/2">
              <div className="mx-auto grid max-w-md gap-4 rounded-2xl border border-slate-700/80 bg-slate-900/70 p-5 shadow-xl shadow-indigo-900/40 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-400">Total balance</p>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
                    +8.3% this month
                  </span>
                </div>
                <p className="bg-gradient-to-r from-slate-50 via-indigo-100 to-emerald-100 bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
                  $24,580.22
                </p>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-3 shadow-sm shadow-indigo-900/30">
                    <p className="text-[11px] text-slate-400">Savings</p>
                    <p className="mt-1 font-semibold text-sky-100">$8,240</p>
                  </div>
                  <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-3 shadow-sm shadow-indigo-900/30">
                    <p className="text-[11px] text-slate-400">Credit</p>
                    <p className="mt-1 font-semibold text-rose-100">$3,120</p>
                  </div>
                  <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-3 shadow-sm shadow-indigo-900/30">
                    <p className="text-[11px] text-slate-400">Investments</p>
                    <p className="mt-1 font-semibold text-emerald-100">$13,220</p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  Personalized journeys will appear here as you explore XeraBank products.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product highlights */}
        <section className="mx-auto max-w-6xl space-y-8 px-6 py-14">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Banking that adapts to you</h2>
              <p className="mt-1 text-xs text-slate-400">
                Smart accounts, transparent credit, and curated investment journeys.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="group space-y-2 rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-sm shadow-indigo-900/20 transition hover:-translate-y-1 hover:border-indigo-400/70 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-indigo-900/40">
              <p className="text-xs font-semibold text-indigo-200">Smart Savings</p>
              <p className="text-sm text-slate-100">High-yield accounts that adjust to your habits.</p>
              <p className="text-[11px] text-slate-400">
                Create goal-based vaults, automate deposits, and track progress in real time.
              </p>
            </div>
            <div className="group space-y-2 rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-sm shadow-indigo-900/20 transition hover:-translate-y-1 hover:border-sky-400/70 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-sky-900/40">
              <p className="text-xs font-semibold text-sky-200">Clarity Credit</p>
              <p className="text-sm text-slate-100">Cards designed around real transparency.</p>
              <p className="text-[11px] text-slate-400">
                Clear interest, instant alerts, and proactive insights to help you stay ahead.
              </p>
            </div>
            <div className="group space-y-2 rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-sm shadow-indigo-900/20 transition hover:-translate-y-1 hover:border-emerald-400/70 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-emerald-900/40">
              <p className="text-xs font-semibold text-emerald-200">Guided Investing</p>
              <p className="text-sm text-slate-100">Portfolios curated for your risk profile.</p>
              <p className="text-[11px] text-slate-400">
                From first-time investors to seasoned traders, get journeys tailored to you.
              </p>
            </div>
          </div>
        </section>

        {/* Where injections can appear */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950/80 via-slate-900/80 to-slate-950/80 p-5 shadow-md shadow-slate-950/60">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
                  Personalized offers
                </p>
                <p className="mt-1 text-sm text-slate-100">
                  As you explore XeraBank, contextual cards and modals may appear with tailored journeys.
                </p>
              </div>
              <p className="text-[11px] text-slate-400">
                This area of the page is wired to the{" "}
                <code className="rounded border border-slate-700 bg-slate-950/80 px-1.5 py-0.5 text-[10px] text-indigo-200">
                  InjectionComponent
                </code>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Injection surfaces mounted within the home page */}
        <InjectionComponent />
      </main>
    </ViewStateProvider>
  )
}