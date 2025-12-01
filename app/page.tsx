'use client'

import React from "react"
import InjectionComponent from "../InjectionComponent"
import ViewStateProvider from "../ViewStateProvider"

export default function HomePage() {
  return (
    <ViewStateProvider>
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-16 text-center text-slate-100">
        <section className="max-w-2xl space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Intentflow Injection Demo
          </h1>
          <p className="text-sm text-slate-300">
            This minimal homepage wires up the Redux-backed{" "}
            <code className="rounded bg-slate-900/60 px-1.5 py-0.5 text-[11px]">InjectionComponent</code>{" "}
            so you can experiment with bottom card and centered modal injections.
          </p>
          <p className="text-xs text-slate-400">
            Interact with your application as usual; when the configured view-state flags become true,
            the injection experiences will appear.
          </p>
        </section>
      </main>

      {/* Injection surfaces are rendered globally on top of the page content */}
      <InjectionComponent />
    </ViewStateProvider>
  )
}


