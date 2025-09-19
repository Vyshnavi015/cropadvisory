"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useOffline } from "@/contexts/offline-context"
import { useLanguage } from "@/contexts/language-context"
import { WifiOff, RefreshCw, X } from "lucide-react"

export function OfflineBanner() {
  const { isOnline, syncData, syncStatus } = useOffline()
  const { t } = useLanguage()
  const [isDismissed, setIsDismissed] = useState(false)

  if (isOnline || isDismissed) return null

  return (
    <Alert className="fixed top-0 left-0 right-0 z-50 rounded-none border-orange-200 bg-orange-50 border-b">
      <WifiOff className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="text-orange-800 font-medium">You're offline. Some features may be limited.</span>
          <span className="text-orange-600 text-sm">Data will sync when connection is restored.</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => syncData()}
            disabled={syncStatus === "syncing"}
            className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
            Retry
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDismissed(true)}
            className="text-orange-600 hover:bg-orange-100"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
