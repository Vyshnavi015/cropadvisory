"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useLanguage } from "./language-context"

export interface Alert {
  id: string
  type: "weather" | "pest" | "market" | "irrigation" | "fertilizer" | "harvest"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionRequired: boolean
  location?: string
  cropType?: string
  expiresAt?: Date
}

interface AlertsContextType {
  alerts: Alert[]
  unreadCount: number
  addAlert: (alert: Omit<Alert, "id" | "timestamp" | "isRead">) => void
  markAsRead: (alertId: string) => void
  markAllAsRead: () => void
  dismissAlert: (alertId: string) => void
  getAlertsByType: (type: Alert["type"]) => Alert[]
  getActiveAlerts: () => Alert[]
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined)

export const useAlerts = () => {
  const context = useContext(AlertsContext)
  if (!context) {
    throw new Error("useAlerts must be used within an AlertsProvider")
  }
  return context
}

export const AlertsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLanguage()
  const [alerts, setAlerts] = useState<Alert[]>([])

  // Initialize with sample alerts
  useEffect(() => {
    const sampleAlerts: Alert[] = [
      {
        id: "1",
        type: "weather",
        severity: "high",
        title: t("alerts.weather"),
        message: "Heavy rainfall expected in next 24 hours. Protect your crops and ensure proper drainage.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        actionRequired: true,
        location: "Punjab, Ludhiana",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
      {
        id: "2",
        type: "pest",
        severity: "critical",
        title: t("alerts.pest"),
        message: "Brown plant hopper detected in nearby farms. Immediate action recommended.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        isRead: false,
        actionRequired: true,
        cropType: "Rice",
        location: "Punjab, Ludhiana",
      },
      {
        id: "3",
        type: "market",
        severity: "medium",
        title: t("alerts.market"),
        message: "Wheat prices increased by 8% in Ludhiana mandi. Good time to sell.",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: true,
        actionRequired: false,
        cropType: "Wheat",
        location: "Ludhiana Mandi",
      },
      {
        id: "4",
        type: "irrigation",
        severity: "medium",
        title: t("alerts.irrigation"),
        message: "Soil moisture levels are low. Consider irrigation for optimal crop growth.",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        isRead: false,
        actionRequired: true,
        cropType: "Cotton",
      },
      {
        id: "5",
        type: "fertilizer",
        severity: "low",
        title: t("alerts.fertilizer"),
        message: "Time for nitrogen application based on your crop growth stage.",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        isRead: false,
        actionRequired: true,
        cropType: "Wheat",
      },
    ]

    setAlerts(sampleAlerts)
  }, [t])

  const addAlert = useCallback((alertData: Omit<Alert, "id" | "timestamp" | "isRead">) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false,
    }
    setAlerts((prev) => [newAlert, ...prev])
  }, [])

  const markAsRead = useCallback((alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, isRead: true } : alert)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })))
  }, [])

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }, [])

  const getAlertsByType = useCallback(
    (type: Alert["type"]) => {
      return alerts.filter((alert) => alert.type === type)
    },
    [alerts],
  )

  const getActiveAlerts = useCallback(() => {
    const now = new Date()
    return alerts.filter((alert) => !alert.expiresAt || alert.expiresAt > now)
  }, [alerts])

  const unreadCount = alerts.filter((alert) => !alert.isRead).length

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        unreadCount,
        addAlert,
        markAsRead,
        markAllAsRead,
        dismissAlert,
        getAlertsByType,
        getActiveAlerts,
      }}
    >
      {children}
    </AlertsContext.Provider>
  )
}
