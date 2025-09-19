"use client"

import { useLanguage, type Language } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Wifi, WifiOff } from "lucide-react"

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
]

export function LanguageSelector() {
  const { language, setLanguage, t, isOnline } = useLanguage()

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <div className="flex items-center gap-2">
      {/* Online/Offline Status Indicator */}
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isOnline
            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
        }`}
      >
        {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {t(isOnline ? "common.online" : "common.offline")}
      </div>

      {/* Language Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{currentLanguage?.nativeName}</span>
            <span className="sm:hidden">{currentLanguage?.code.toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex justify-between ${language === lang.code ? "bg-emerald-50 dark:bg-emerald-900" : ""}`}
            >
              <span>{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
