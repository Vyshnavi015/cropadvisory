"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useLanguage } from "./language-context"
import type { SpeechRecognition, SpeechSynthesis } from "web-speech-api"

interface VoiceContextType {
  isListening: boolean
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  speak: (text: string) => void
  isSpeaking: boolean
  stopSpeaking: () => void
  transcript: string
  confidence: number
  autoTTSEnabled: boolean
  toggleAutoTTS: () => void
  speakPageContent: (content: string) => void
  speakSelection: (text: string) => void
  speakNavigation: (destination: string) => void
  speakInteraction: (action: string, element?: string) => void
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export const useVoice = () => {
  const context = useContext(VoiceContext)
  if (!context) {
    throw new Error("useVoice must be used within a VoiceProvider")
  }
  return context
}

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, t } = useLanguage()
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null)
  const [autoTTSEnabled, setAutoTTSEnabled] = useState(false)
  const [speechQueue, setSpeechQueue] = useState<string[]>([])
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)

  // Language mapping for speech recognition and synthesis
  const languageMap: Record<string, string> = {
    en: "en-US",
    hi: "hi-IN",
    bn: "bn-IN",
    te: "te-IN",
    mr: "mr-IN",
    ta: "ta-IN",
    gu: "gu-IN",
    kn: "kn-IN",
    or: "or-IN",
    pa: "pa-IN",
    ml: "ml-IN",
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPreference = localStorage.getItem("autoTTSEnabled")
      if (savedPreference !== null) {
        setAutoTTSEnabled(JSON.parse(savedPreference))
      }
    }
  }, [])

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const speechSynthesis = window.speechSynthesis

      if (SpeechRecognition && speechSynthesis) {
        setIsSupported(true)
        setSynthesis(speechSynthesis)

        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = languageMap[language] || "en-US"

        recognitionInstance.onresult = (event) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            const confidence = event.results[i][0].confidence

            if (event.results[i].isFinal) {
              finalTranscript += transcript
              setConfidence(confidence)
            } else {
              interimTranscript += transcript
            }
          }

          setTranscript(finalTranscript || interimTranscript)
        }

        recognitionInstance.onstart = () => setIsListening(true)
        recognitionInstance.onend = () => setIsListening(false)
        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [language])

  useEffect(() => {
    if (speechQueue.length > 0 && !isProcessingQueue && autoTTSEnabled && synthesis) {
      setIsProcessingQueue(true)
      const nextText = speechQueue[0]
      setSpeechQueue((prev) => prev.slice(1))

      const utterance = new SpeechSynthesisUtterance(nextText)
      utterance.lang = languageMap[language] || "en-US"
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onend = () => {
        setIsProcessingQueue(false)
      }
      utterance.onerror = () => {
        setIsProcessingQueue(false)
      }

      // Try to find a voice for the selected language
      const voices = synthesis.getVoices()
      const preferredVoice = voices.find((voice) => voice.lang.startsWith(languageMap[language]?.split("-")[0] || "en"))

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      synthesis.speak(utterance)
    }
  }, [speechQueue, isProcessingQueue, autoTTSEnabled, synthesis, language])

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      recognition.lang = languageMap[language] || "en-US"
      recognition.start()
      setTranscript("")
    }
  }, [recognition, isListening, language])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
    }
  }, [recognition, isListening])

  const speak = useCallback(
    (text: string) => {
      if (synthesis && text) {
        // Stop any ongoing speech
        synthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = languageMap[language] || "en-US"
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 1

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        // Try to find a voice for the selected language
        const voices = synthesis.getVoices()
        const preferredVoice = voices.find((voice) =>
          voice.lang.startsWith(languageMap[language]?.split("-")[0] || "en"),
        )

        if (preferredVoice) {
          utterance.voice = preferredVoice
        }

        synthesis.speak(utterance)
      }
    },
    [synthesis, language],
  )

  const stopSpeaking = useCallback(() => {
    if (synthesis) {
      synthesis.cancel()
      setIsSpeaking(false)
      setSpeechQueue([])
      setIsProcessingQueue(false)
    }
  }, [synthesis])

  const toggleAutoTTS = useCallback(() => {
    const newValue = !autoTTSEnabled
    setAutoTTSEnabled(newValue)
    if (typeof window !== "undefined") {
      localStorage.setItem("autoTTSEnabled", JSON.stringify(newValue))
    }

    if (newValue) {
      setSpeechQueue((prev) => [...prev, t("autoTTSEnabled")])
    } else {
      stopSpeaking()
      speak(t("autoTTSDisabled"))
    }
  }, [autoTTSEnabled, speak, stopSpeaking, t])

  const speakPageContent = useCallback(
    (content: string) => {
      if (autoTTSEnabled && content) {
        setSpeechQueue((prev) => [...prev, content])
      }
    },
    [autoTTSEnabled],
  )

  const speakSelection = useCallback(
    (text: string) => {
      if (autoTTSEnabled && text) {
        setSpeechQueue((prev) => [...prev, `${t("selected")}: ${text}`])
      }
    },
    [autoTTSEnabled, t],
  )

  const speakNavigation = useCallback(
    (destination: string) => {
      if (autoTTSEnabled && destination) {
        setSpeechQueue((prev) => [...prev, `${t("navigatingTo")} ${destination}`])
      }
    },
    [autoTTSEnabled, t],
  )

  const speakInteraction = useCallback(
    (action: string, element?: string) => {
      if (autoTTSEnabled && action) {
        const message = element ? `${action} ${element}` : action
        setSpeechQueue((prev) => [...prev, message])
      }
    },
    [autoTTSEnabled],
  )

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        isSupported,
        startListening,
        stopListening,
        speak,
        isSpeaking,
        stopSpeaking,
        transcript,
        confidence,
        autoTTSEnabled,
        toggleAutoTTS,
        speakPageContent,
        speakSelection,
        speakNavigation,
        speakInteraction,
      }}
    >
      {children}
    </VoiceContext.Provider>
  )
}
