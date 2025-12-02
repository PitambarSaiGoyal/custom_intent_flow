'use client'

import React from "react"
import InjectionComponent from "../InjectionComponent"
import ViewStateProvider from "../ViewStateProvider"

export default function HomePage() {
  return (
    <ViewStateProvider>
      <main className="min-h-screen bg-slate-950 text-slate-50">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-center lg:py-24">
            <div className="space-y-6 lg:w-1/2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
                Welcome to XeraBank
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Modern banking for <span className="text-indigo-300">your</span> every day.
              </h1>
              <p className="max-w-xl text-sm text-slate-300 sm:text-base">
                Manage savings, credit, and investments in one intuitive dashboard. Real-time insights,
                instant alerts, and journeys tailored to your financial goals.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
                  Open an account
                </button>
                <button className="rounded-md border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-slate-400 hover:text-white">
                  Explore products
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                FDIC insured • 24/7 support • No hidden fees
              </p>
            </div>

            <div className="lg:w-1/2">
              <div className="mx-auto grid max-w-md gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-400">Total balance</p>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                    +8.3% this month
                  </span>
                </div>
                <p className="text-2xl font-semibold tracking-tight">$24,580.22</p>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-lg bg-slate-900/80 p-3">
                    <p className="text-[11px] text-slate-400">Savings</p>
                    <p className="mt-1 font-semibold">$8,240</p>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 p-3">
                    <p className="text-[11px] text-slate-400">Credit</p>
                    <p className="mt-1 font-semibold">$3,120</p>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 p-3">
                    <p className="text-[11px] text-slate-400">Investments</p>
                    <p className="mt-1 font-semibold">$13,220</p>
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
        <section className="mx-auto max-w-6xl px-6 py-12 space-y-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Banking that adapts to you</h2>
              <p className="mt-1 text-xs text-slate-400">
                Smart accounts, transparent credit, and curated investment journeys.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-xs font-semibold text-indigo-200">Smart Savings</p>
              <p className="text-sm text-slate-200">High-yield accounts that adjust to your habits.</p>
              <p className="text-[11px] text-slate-400">
                Create goal-based vaults, automate deposits, and track progress in real time.
              </p>
            </div>
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-xs font-semibold text-indigo-200">Clarity Credit</p>
              <p className="text-sm text-slate-200">Cards designed around real transparency.</p>
              <p className="text-[11px] text-slate-400">
                Clear interest, instant alerts, and proactive insights to help you stay ahead.
              </p>
            </div>
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-xs font-semibold text-indigo-200">Guided Investing</p>
              <p className="text-sm text-slate-200">Portfolios curated for your risk profile.</p>
              <p className="text-[11px] text-slate-400">
                From first-time investors to seasoned traders, get journeys tailored to you.
              </p>
            </div>
          </div>
        </section>

        {/* Where injections can appear */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
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
                <code className="rounded bg-slate-950/80 px-1.5 py-0.5 text-[10px]">InjectionComponent</code>.
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