"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useVoice } from "@/contexts/voice-context"
import { useLanguage } from "@/contexts/language-context"
import { Mic, MicOff, Volume2, VolumeX, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

export function VoiceAssistant() {
  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
    speak,
    isSpeaking,
    stopSpeaking,
    transcript,
    confidence,
  } = useVoice()
  const { t, language } = useLanguage()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [lastCommand, setLastCommand] = useState("")

  // Voice command processing
  useEffect(() => {
    if (transcript && transcript !== lastCommand) {
      setLastCommand(transcript)
      processVoiceCommand(transcript.toLowerCase())
    }
  }, [transcript])

  const processVoiceCommand = (command: string) => {
    // Define command patterns for different languages
    const commandPatterns = {
      en: {
        dashboard: ["dashboard", "home", "main page"],
        weather: ["weather", "forecast", "climate"],
        pest: ["pest", "disease", "bug", "insect"],
        market: ["market", "price", "rates", "mandi"],
        advisory: ["advisory", "advice", "recommendation", "crop advice"],
        profile: ["profile", "account", "settings"],
      },
      hi: {
        dashboard: ["डैशबोर्ड", "होम", "मुख्य पृष्ठ"],
        weather: ["मौसम", "पूर्वानुमान", "जलवायु"],
        pest: ["कीट", "बीमारी", "रोग"],
        market: ["बाजार", "भाव", "दर", "मंडी"],
        advisory: ["सलाह", "सुझाव", "फसल सलाह"],
        profile: ["प्रोफाइल", "खाता", "सेटिंग्स"],
      },
      // Add more language patterns as needed
    }

    const patterns = commandPatterns[language as keyof typeof commandPatterns] || commandPatterns.en

    // Check for navigation commands
    for (const [route, keywords] of Object.entries(patterns)) {
      if (keywords.some((keyword) => command.includes(keyword))) {
        handleNavigation(route)
        return
      }
    }

    // Check for action commands
    if (command.includes("read") || command.includes("speak") || command.includes("पढ़ें")) {
      readCurrentPage()
    }
  }

  const handleNavigation = (route: string) => {
    const routes = {
      dashboard: "/dashboard",
      weather: "/weather",
      pest: "/pest-detection",
      market: "/market-prices",
      advisory: "/crop-advisory",
      profile: "/profile",
    }

    const targetRoute = routes[route as keyof typeof routes]
    if (targetRoute) {
      router.push(targetRoute)
      speak(t(`nav.${route}`) + " " + t("common.loading"))
    }
  }

  const readCurrentPage = () => {
    // Get page title and main content to read aloud
    const pageTitle = document.title
    const mainContent = document.querySelector("main")?.textContent?.slice(0, 200) || ""
    speak(`${pageTitle}. ${mainContent}`)
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      speak(t("home.title"))
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card
        className={`transition-all duration-300 ${isExpanded ? "w-80" : "w-16"} bg-white/95 backdrop-blur-sm border-emerald-200 shadow-lg`}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-emerald-50"
            >
              <MessageSquare className="h-5 w-5 text-emerald-600" />
            </Button>

            {isExpanded && (
              <div className="flex gap-2">
                <Button
                  variant={isListening ? "destructive" : "default"}
                  size="sm"
                  onClick={toggleListening}
                  className={`${isListening ? "bg-red-500 hover:bg-red-600" : "bg-emerald-600 hover:bg-emerald-700"} text-white`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>

                <Button
                  variant={isSpeaking ? "destructive" : "outline"}
                  size="sm"
                  onClick={toggleSpeaking}
                  className={
                    isSpeaking
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  }
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>

          {isExpanded && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={isListening ? "destructive" : "secondary"} className="text-xs">
                  {isListening ? t("voice.listening") : t("voice.ready")}
                </Badge>
                {confidence > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {Math.round(confidence * 100)}%
                  </Badge>
                )}
              </div>

              {transcript && (
                <div className="bg-emerald-50 p-2 rounded text-sm text-emerald-800">
                  <strong>{t("voice.transcript")}:</strong> {transcript}
                </div>
              )}

              <div className="text-xs text-gray-600">
                <p>
                  <strong>{t("voice.commands")}:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>"{t("nav.dashboard")}"</li>
                  <li>"{t("nav.weather")}"</li>
                  <li>"{t("nav.pestDetection")}"</li>
                  <li>"{t("nav.marketPrices")}"</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
