import { configureStore } from "@reduxjs/toolkit"
import viewStateReducer from "./viewStateSlice"

/**
 * Single line comment describing store creation
 */
export const viewStateStore = configureStore({
  reducer: {
    viewState: viewStateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

console.log("[viewStateStore] store initialized", {
  stateKeys: Object.keys(viewStateStore.getState()),
})

export type ViewStateStore = typeof viewStateStore
export type ViewStateDispatch = ViewStateStore["dispatch"]
export type ViewStateRootState = ReturnType<typeof viewStateStore.getState>

