"use client"

import React from "react"
import { LanguageProvider } from "@/contexts/language-context"
import { VoiceProvider } from "@/contexts/voice-context"
import { AlertsProvider } from "@/contexts/alerts-context"
import { OfflineProvider } from "@/contexts/offline-context"
import { VoiceAssistant } from "@/components/voice-assistant"
import { AlertNotification } from "@/components/alert-notification"
import { OfflineIndicator } from "@/components/offline-indicator"
import { OfflineBanner } from "@/components/offline-banner"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-emerald-700 font-medium">Loading Smart Crop Advisory...</p>
          </div>
        </div>
      }
    >
      <LanguageProvider>
        <VoiceProvider>
          <AlertsProvider>
            <OfflineProvider>
              <OfflineBanner />
              {children}
              <VoiceAssistant />
              <AlertNotification />
              <OfflineIndicator />
            </OfflineProvider>
          </AlertsProvider>
        </VoiceProvider>
      </LanguageProvider>
    </React.Suspense>
  )
}
