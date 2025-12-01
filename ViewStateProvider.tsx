/* eslint-disable @next/next/no-assign-module-variable */
'use client'
import React from "react"
import { Provider, useSelector } from "react-redux"
import { viewStateStore, type ViewStateRootState } from "./store"

/**
 * Single line comment explaining provider component
 */
const ViewStateProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  console.log("[ViewStateProvider] rendering provider")
  // return (<Provider store={viewStateStore}>{children}</Provider>)
  return (
    <Provider store={viewStateStore}>
      <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-slate-300 bg-white/95 p-4 shadow-lg backdrop-blur">
        <ViewStateOverview />
      </div>
      {children}
    </Provider>
  )
}

export default ViewStateProvider

const stateKeysToDisplay: Array<keyof ViewStateRootState["viewState"]> = [
  "viewedHome",
  "clickedLoans",
  "exploredSavings",
  "checkedCreditCards",
  "openedInvestments",
  "viewedCalculator",
]

const ViewStateOverview: React.FC = () => {
  const viewState = useSelector((state: ViewStateRootState) => state.viewState)

  return (
    <div className="text-xs text-slate-700 space-y-2">
      <p className="font-semibold text-slate-900">View State Debug</p>
      <div className="space-y-1">
        {stateKeysToDisplay.map((key) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="font-medium text-slate-600">{key}</span>
            <span
              className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                viewState[key] ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
              }`}
            >
              {String(viewState[key])}
            </span>
          </div>
        ))}
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-slate-900">injectionConfig</p>
        <pre className="max-h-32 overflow-auto rounded bg-slate-100 p-2 text-[10px] leading-tight text-slate-600">
          {JSON.stringify(viewState.injectionConfig, null, 2)}
        </pre>
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-slate-900">fullIFConfig</p>
        <pre className="max-h-32 overflow-auto rounded bg-slate-100 p-2 text-[10px] leading-tight text-slate-600">
          {JSON.stringify(viewState.fullIFConfig, null, 2)}
        </pre>
      </div>
    </div>
  )
}