"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOffline } from "@/contexts/offline-context"
import { useLanguage } from "@/contexts/language-context"
import { Wifi, WifiOff, Download, RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react"

export function OfflineIndicator() {
  const { isOnline, syncStatus, lastSyncTime, downloadData, syncData, getDataSize } = useOffline()
  const { t } = useLanguage()
  const [showDetails, setShowDetails] = useState(false)

  const formatLastSync = (date: Date | null) => {
    if (!date) return "Never"

    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return <RefreshCw className="h-3 w-3 animate-spin" />
      case "success":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "error":
        return <AlertCircle className="h-3 w-3 text-red-500" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case "syncing":
        return "Syncing..."
      case "success":
        return "Synced"
      case "error":
        return "Sync failed"
      default:
        return formatLastSync(lastSyncTime)
    }
  }

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Card
        className={`transition-all duration-300 cursor-pointer ${
          isOnline ? "bg-white/95 border-emerald-200" : "bg-orange-50/95 border-orange-200"
        } backdrop-blur-sm shadow-lg hover:shadow-xl`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi className="h-4 w-4 text-emerald-600" /> : <WifiOff className="h-4 w-4 text-orange-600" />}

            <Badge
              variant={isOnline ? "default" : "secondary"}
              className={`text-xs ${isOnline ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"}`}
            >
              {t(isOnline ? "common.online" : "common.offline")}
            </Badge>

            <div className="flex items-center gap-1 text-xs text-gray-600">
              {getSyncStatusIcon()}
              <span>{getSyncStatusText()}</span>
            </div>
          </div>

          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Offline data:</span>
                <span className="font-medium">{getDataSize()}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    downloadData()
                  }}
                  disabled={!isOnline || syncStatus === "syncing"}
                  className="flex-1 text-xs h-7"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    syncData()
                  }}
                  disabled={!isOnline || syncStatus === "syncing"}
                  className="flex-1 text-xs h-7"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
                  Sync
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
