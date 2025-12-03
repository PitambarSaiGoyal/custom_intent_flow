'use client'
import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

export type InjectionComponentContent = {
  content: string
  imageUrl: string
  link: string
}

export type InjectionComponentProps = {
  bottomCardContent?: InjectionComponentContent
  centeredModalContent?: InjectionComponentContent
}

/**
 * Single line comment describing injection component behavior
 */


const InjectionComponent: React.FC<InjectionComponentProps> = () => {
  const [bottomCardDismissed, setBottomCardDismissed] = useState(true)
  const [centeredModalDismissed, setCenteredModalDismissed] = useState(true)
  const [componentLink, setComponentLink] = useState('')
  const [innerContent, setInnerContent] = useState('')

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
        else if(responseData.components.type == 'centredModal')
          setCenteredModalDismissed(false)
      }
      
    }

    const intervalId = setInterval(() => {
      void updateState()
    }, 10000)

    void updateState()

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  

  return (
    <>
      {showBottomCard ? (
        <BottomCardInnerHTML
          innerContent={ innerContent ? innerContent : '<b>TESTING!!!!</b>'}
          link={componentLink ? componentLink : '/'}
          onClose={() => setBottomCardDismissed(true)}
        />
      ) : null}
      {showCentralModal ? (
        <CenteredModalInnerHTML
          innerContent={ innerContent ? innerContent : '<b>TESTING!!!!</b>'}
          link={componentLink ? componentLink : '/'}
          onClose={() => setBottomCardDismissed(true)}
        />
      ) : null}
    </>
  )
}

export default InjectionComponent

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

function CenteredModalInnerHTML({
  innerContent,
  link,
  onClose,
}: {
  innerContent: string
  link: string
  onClose: () => void
}) {
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
        <Link
          href={link}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div 
            className="text-xs text-slate-600"
            dangerouslySetInnerHTML={{ __html: innerContent }}
          /><br/>
        </Link>
      </div>
    </div>
  )
}

