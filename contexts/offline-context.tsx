"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useLanguage } from "./language-context"

interface OfflineData {
  weather: any
  market: any
  alerts: any[]
  profile: any
  settings: any
  timestamp: string
}

interface OfflineContextType {
  isOnline: boolean
  offlineData: OfflineData | null
  syncStatus: "idle" | "syncing" | "success" | "error"
  lastSyncTime: Date | null
  downloadData: () => Promise<void>
  syncData: () => Promise<void>
  getOfflineWeather: () => any
  getOfflineMarket: () => any
  saveOfflineData: (key: keyof OfflineData, data: any) => void
  clearOfflineData: () => void
  getDataSize: () => string
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

export const useOffline = () => {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error("useOffline must be used within an OfflineProvider")
  }
  return context
}

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnline: languageIsOnline } = useLanguage()
  const [isOnline, setIsOnline] = useState(true)
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null)
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle")
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  // Initialize offline data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("offline-data")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setOfflineData(parsed)
        setLastSyncTime(new Date(parsed.timestamp))
      } catch (error) {
        console.error("Failed to parse offline data:", error)
      }
    }

    // Load last sync time
    const lastSync = localStorage.getItem("last-sync-time")
    if (lastSync) {
      setLastSyncTime(new Date(lastSync))
    }
  }, [])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Initial check
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && offlineData && syncStatus === "idle") {
      // Auto-sync if data is older than 1 hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      if (!lastSyncTime || lastSyncTime < oneHourAgo) {
        syncData()
      }
    }
  }, [isOnline])

  const downloadData = useCallback(async () => {
    if (!isOnline) return

    setSyncStatus("syncing")
    try {
      // Download weather data
      const weatherResponse = await fetch("/api/weather?city=Ludhiana,IN")
      const weatherData = weatherResponse.ok ? await weatherResponse.json() : null

      // Download forecast data
      const forecastResponse = await fetch("/api/weather/forecast?city=Ludhiana,IN")
      const forecastData = forecastResponse.ok ? await forecastResponse.json() : null

      // Download market data
      const marketResponse = await fetch("/api/market")
      const marketData = marketResponse.ok ? await marketResponse.json() : null

      // Get current profile and settings
      const profile = JSON.parse(localStorage.getItem("user-profile") || "{}")
      const settings = JSON.parse(localStorage.getItem("app-settings") || "{}")

      const newOfflineData: OfflineData = {
        weather: {
          current: weatherData,
          forecast: forecastData,
        },
        market: marketData,
        alerts: JSON.parse(localStorage.getItem("alerts-data") || "[]"),
        profile,
        settings,
        timestamp: new Date().toISOString(),
      }

      setOfflineData(newOfflineData)
      localStorage.setItem("offline-data", JSON.stringify(newOfflineData))

      const now = new Date()
      setLastSyncTime(now)
      localStorage.setItem("last-sync-time", now.toISOString())

      setSyncStatus("success")
      setTimeout(() => setSyncStatus("idle"), 3000)
    } catch (error) {
      console.error("Failed to download data:", error)
      setSyncStatus("error")
      setTimeout(() => setSyncStatus("idle"), 3000)
    }
  }, [isOnline])

  const syncData = useCallback(async () => {
    if (!isOnline) return
    await downloadData()
  }, [isOnline, downloadData])

  const getOfflineWeather = useCallback(() => {
    return offlineData?.weather || null
  }, [offlineData])

  const getOfflineMarket = useCallback(() => {
    return offlineData?.market || null
  }, [offlineData])

  const saveOfflineData = useCallback(
    (key: keyof OfflineData, data: any) => {
      if (!offlineData) return

      const updatedData = {
        ...offlineData,
        [key]: data,
        timestamp: new Date().toISOString(),
      }

      setOfflineData(updatedData)
      localStorage.setItem("offline-data", JSON.stringify(updatedData))
    },
    [offlineData],
  )

  const clearOfflineData = useCallback(() => {
    setOfflineData(null)
    localStorage.removeItem("offline-data")
    localStorage.removeItem("last-sync-time")
    setLastSyncTime(null)
  }, [])

  const getDataSize = useCallback(() => {
    if (!offlineData) return "0 KB"

    const dataString = JSON.stringify(offlineData)
    const sizeInBytes = new Blob([dataString]).size

    if (sizeInBytes < 1024) return `${sizeInBytes} B`
    if (sizeInBytes < 1024 * 1024) return `${Math.round(sizeInBytes / 1024)} KB`
    return `${Math.round((sizeInBytes / (1024 * 1024)) * 10) / 10} MB`
  }, [offlineData])

  return (
    <OfflineContext.Provider
      value={{
        isOnline: isOnline && languageIsOnline,
        offlineData,
        syncStatus,
        lastSyncTime,
        downloadData,
        syncData,
        getOfflineWeather,
        getOfflineMarket,
        saveOfflineData,
        clearOfflineData,
        getDataSize,
      }}
    >
      {children}
    </OfflineContext.Provider>
  )
}
