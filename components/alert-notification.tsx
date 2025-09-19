"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAlerts, type Alert } from "@/contexts/alerts-context"
import { useVoice } from "@/contexts/voice-context"
import { X, Volume2, CheckCircle } from "lucide-react"

export function AlertNotification() {
  const { alerts, markAsRead, dismissAlert } = useAlerts()
  const { speak } = useVoice()
  const [visibleAlert, setVisibleAlert] = useState<Alert | null>(null)
  const [hasSpoken, setHasSpoken] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Show the most recent unread critical or high severity alert
    const criticalAlerts = alerts.filter(
      (alert) => !alert.isRead && (alert.severity === "critical" || alert.severity === "high"),
    )

    if (criticalAlerts.length > 0) {
      const latestAlert = criticalAlerts[0]
      setVisibleAlert(latestAlert)

      // Speak the alert if not already spoken
      if (!hasSpoken.has(latestAlert.id)) {
        speak(`${latestAlert.title}. ${latestAlert.message}`)
        setHasSpoken((prev) => new Set(prev).add(latestAlert.id))
      }
    } else {
      setVisibleAlert(null)
    }
  }, [alerts, speak, hasSpoken])

  const handleDismiss = () => {
    if (visibleAlert) {
      setVisibleAlert(null)
    }
  }

  const handleMarkAsRead = () => {
    if (visibleAlert) {
      markAsRead(visibleAlert.id)
      setVisibleAlert(null)
    }
  }

  const handleSpeak = () => {
    if (visibleAlert) {
      speak(`${visibleAlert.title}. ${visibleAlert.message}`)
    }
  }

  if (!visibleAlert) return null

  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-50"
      case "high":
        return "border-orange-500 bg-orange-50"
      case "medium":
        return "border-yellow-500 bg-yellow-50"
      case "low":
        return "border-blue-500 bg-blue-50"
      default:
        return "border-gray-500 bg-gray-50"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-right-full">
      <Card className={`border-l-4 ${getSeverityColor(visibleAlert.severity)} shadow-lg`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{visibleAlert.title}</h4>
              <Badge
                className={
                  visibleAlert.severity === "critical" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"
                }
              >
                {visibleAlert.severity}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 -mt-1 -mr-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-gray-700 text-sm mb-3">{visibleAlert.message}</p>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleMarkAsRead} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Mark Read
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSpeak}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            >
              <Volume2 className="h-3 w-3 mr-1" />
              Speak
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
