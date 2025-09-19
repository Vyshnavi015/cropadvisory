"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useVoice } from "@/contexts/voice-context"
import { useLanguage } from "@/contexts/language-context"

export const useAutoTTS = () => {
  const { autoTTSEnabled, speakPageContent, speakSelection, speakInteraction } = useVoice()
  const { t } = useLanguage()
  const lastSpokenRef = useRef<string>("")

  // Speak page title when component mounts
  const speakPageTitle = (title: string) => {
    if (autoTTSEnabled && title && title !== lastSpokenRef.current) {
      lastSpokenRef.current = title
      speakPageContent(`${t("pageLoaded")}: ${title}`)
    }
  }

  // Speak element content when hovered or focused
  const speakOnHover = (text: string) => {
    if (autoTTSEnabled && text) {
      speakSelection(text)
    }
  }

  // Speak button actions
  const speakButtonAction = (buttonText: string) => {
    if (autoTTSEnabled && buttonText) {
      speakInteraction(t("buttonPressed"), buttonText)
    }
  }

  // Speak form field focus
  const speakFieldFocus = (fieldName: string) => {
    if (autoTTSEnabled && fieldName) {
      speakInteraction(t("focusedOn"), fieldName)
    }
  }

  // Speak navigation
  const speakNavigation = (destination: string) => {
    if (autoTTSEnabled && destination) {
      speakInteraction(t("navigatingTo"), destination)
    }
  }

  return {
    speakPageTitle,
    speakOnHover,
    speakButtonAction,
    speakFieldFocus,
    speakNavigation,
    autoTTSEnabled,
  }
}

export const withAutoTTS = <P extends object>(Component: React.ComponentType<P>, pageTitle: string) => {
  return function AutoTTSWrapper(props: P) {
    const { speakPageTitle } = useAutoTTS()

    useEffect(() => {
      speakPageTitle(pageTitle)
    }, [speakPageTitle])

    return <Component {...props} />
  }
}
