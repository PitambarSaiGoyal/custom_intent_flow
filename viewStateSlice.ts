import { createSlice, PayloadAction } from "@reduxjs/toolkit"

/**
 * Single line comment describing slice state shape
 */
export type InjectionVisibilityConfig = {
  bottomCard?: string[]
  centeredModal?: string[]
}

export type InjectionComponentContent = {
  content: string
  imageUrl: string
  link: string
}

export type EventFlagMappingEntry = {
  event: string
  componentContent: string
  flags: string[]
}

export type FlowStepConfig = {
  parentUIComp?: string
  action?: string
  flag?: string[]
  flags?: string[]
}

export type ComponentPropsConfig = {
  bottomCard?: InjectionComponentContent
  centeredModal?: InjectionComponentContent
}

export type FullIFConfig = {
  flowSteps?: FlowStepConfig[]
  componentProps?: ComponentPropsConfig
  eventFlagMapping?: Record<string, EventFlagMappingEntry>
  injectionConfig?: InjectionVisibilityConfig
}

export type ViewState = {
  viewedHome: boolean
  clickedLoans: boolean
  exploredSavings: boolean
  checkedCreditCards: boolean
  openedInvestments: boolean
  viewedCalculator: boolean
  injectionConfig: InjectionVisibilityConfig
  componentProps: {
    bottomCard?: InjectionComponentContent
    centeredModal?: InjectionComponentContent
  }
  eventFlagMapping: Record<string, EventFlagMappingEntry>
  fullIFConfig: FullIFConfig | null
}

const initialState: ViewState = {
  viewedHome: false,
  clickedLoans: false,
  exploredSavings: false,
  checkedCreditCards: false,
  openedInvestments: false,
  viewedCalculator: false,
  injectionConfig: {},
  componentProps: {},
  eventFlagMapping: {},
  fullIFConfig: null,
}

const viewStateSlice = createSlice({
  name: "viewState",
  initialState,
  reducers: {
    /**
     * Single line comment explaining action
     */
    setViewedHome(state, action: PayloadAction<boolean>) {
      console.log("[viewStateSlice] setViewedHome action dispatch", {
        payload: action.payload,
      })
      state.viewedHome = action.payload
    },
    /**
     * Single line comment explaining toggle
     */
    toggleViewedHome(state) {
      console.log("[viewStateSlice] toggleViewedHome action dispatch", {
        previous: state.viewedHome,
        next: !state.viewedHome,
      })
      state.viewedHome = !state.viewedHome
    },
    /**
     * Single line comment explaining toggle
     */
    toggleClickedLoans(state) {
      console.log("[viewStateSlice] toggleClickedLoans action dispatch", {
        previous: state.clickedLoans,
        next: !state.clickedLoans,
      })
      state.clickedLoans = !state.clickedLoans
    },
    /**
     * Single line comment explaining toggle
     */
    toggleExploredSavings(state) {
      console.log("[viewStateSlice] toggleExploredSavings action dispatch", {
        previous: state.exploredSavings,
        next: !state.exploredSavings,
      })
      state.exploredSavings = !state.exploredSavings
    },
    /**
     * Single line comment explaining toggle
     */
    toggleCheckedCreditCards(state) {
      console.log("[viewStateSlice] toggleCheckedCreditCards action dispatch", {
        previous: state.checkedCreditCards,
        next: !state.checkedCreditCards,
      })
      state.checkedCreditCards = !state.checkedCreditCards
    },
    /**
     * Single line comment explaining toggle
     */
    toggleOpenedInvestments(state) {
      console.log("[viewStateSlice] toggleOpenedInvestments action dispatch", {
        previous: state.openedInvestments,
        next: !state.openedInvestments,
      })
      state.openedInvestments = !state.openedInvestments
    },
    /**
     * Single line comment explaining toggle
     */
    toggleViewedCalculator(state) {
      console.log("[viewStateSlice] toggleViewedCalculator action dispatch", {
        previous: state.viewedCalculator,
        next: !state.viewedCalculator,
      })
      state.viewedCalculator = !state.viewedCalculator
    },
    setInjectionVisibilityConfig(state, action: PayloadAction<InjectionVisibilityConfig>) {
      console.log("[viewStateSlice] setInjectionVisibilityConfig action dispatch", {
        payload: action.payload,
      })
      state.injectionConfig = action.payload
    },
    setFlagsTrue(state, action: PayloadAction<string[]>) {
      console.log("[viewStateSlice] setFlagsTrue action dispatch", {
        flags: action.payload,
      })
      action.payload.forEach((flag) => {
        if (flag in state) {
          const value = (state as Record<string, unknown>)[flag]
          if (typeof value === "boolean") {
            ;(state as Record<string, unknown>)[flag] = true
          }
        }
      })
    },
    /**
     * Single line comment explaining config capture
     */
    setFullIFConfig(state, action: PayloadAction<FullIFConfig | null>) {
      console.log("[viewStateSlice] setFullIFConfig action dispatch", {
        payload: action.payload,
      })
      state.fullIFConfig = action.payload
    },
  },
})

export const {
  setViewedHome,
  toggleViewedHome,
  toggleClickedLoans,
  toggleExploredSavings,
  toggleCheckedCreditCards,
  toggleOpenedInvestments,
  toggleViewedCalculator,
  setInjectionVisibilityConfig,
  setFlagsTrue,
  setFullIFConfig,
} = viewStateSlice.actions
export default viewStateSlice.reducer

