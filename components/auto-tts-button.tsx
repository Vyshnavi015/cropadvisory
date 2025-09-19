"use client"

import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { useVoice } from "@/contexts/voice-context"
import { useLanguage } from "@/contexts/language-context"

export const AutoTTSButton = () => {
  const { autoTTSEnabled, toggleAutoTTS, isSupported } = useVoice()
  const { t } = useLanguage()

  if (!isSupported) return null

  return (
    <Button
      variant={autoTTSEnabled ? "default" : "outline"}
      size="sm"
      onClick={toggleAutoTTS}
      className="flex items-center gap-2"
      title={autoTTSEnabled ? t("disableAutoTTS") : t("enableAutoTTS")}
    >
      {autoTTSEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      <span className="hidden sm:inline">{autoTTSEnabled ? t("autoTTSOn") : t("autoTTSOff")}</span>
    </Button>
  )
}
