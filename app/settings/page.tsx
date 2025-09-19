"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import { useVoice } from "@/contexts/voice-context"
import { Settings, Globe, Bell, Mic, Wifi, WifiOff, Shield, Save, RotateCcw, User, MapPin, Wheat, Phone, Download, Upload, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const { language, setLanguage, t, isOnline } = useLanguage()
  const { isSupported: voiceSupported } = useVoice()

  // Settings state
  const [settings, setSettings] = useState({
    // Profile settings
    name: "",
    phone: "",
    area: "",
    state: "",
    district: "",
    farmSize: "",
    primaryCrops: [] as string[],
    
    // Voice settings
    enableVoice: true,
    enableTTS: true,
    voiceLanguage: language,
    speechRate: [0.9],

    // Notification settings
    enableNotifications: true,
    phoneNotifications: true,
    emailNotifications: false,
    weatherAlerts: true,
    pestAlerts: true,
    marketAlerts: true,
    priceAlerts: true,
    advisoryAlerts: true,
    emergencyAlerts: true,

    // Offline settings
    offlineMode: false,
    autoSync: true,
    dataUsage: "medium",
    
    // Privacy settings
    dataSharing: false,
    analytics: true,
    crashReporting: true,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिंदी" },
    { code: "bn", name: "Bengali", native: "বাংলা" },
    { code: "te", name: "Telugu", native: "తెలుగు" },
    { code: "mr", name: "Marathi", native: "मराठी" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
    { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
    { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
    { code: "ml", name: "Malayalam", native: "മലയാളം" },
  ]

  const states = [
    "Punjab", "Haryana", "Uttar Pradesh", "Bihar", "West Bengal", "Tamil Nadu", 
    "Karnataka", "Maharashtra", "Gujarat", "Rajasthan", "Madhya Pradesh", 
    "Andhra Pradesh", "Telangana", "Kerala", "Odisha", "Assam", "Jharkhand", 
    "Chhattisgarh", "Himachal Pradesh", "Uttarakhand", "Delhi", "Chandigarh"
  ]

  const crops = [
    "Wheat", "Rice", "Cotton", "Sugarcane", "Maize", "Soybean", "Groundnut", 
    "Mustard", "Sunflower", "Potato", "Onion", "Tomato", "Chili", "Brinjal", 
    "Okra", "Cabbage", "Cauliflower", "Carrot", "Radish", "Spinach", "Coriander",
    "Fenugreek", "Mint", "Basil", "Turmeric", "Ginger", "Garlic", "Cumin",
    "Fennel", "Cardamom", "Black Pepper", "Cinnamon", "Clove", "Nutmeg"
  ]

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("app-settings")
    const savedProfile = localStorage.getItem("user-profile")
    
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      setSettings(prev => ({ ...prev, ...parsedSettings }))
    }
    
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile)
      setSettings(prev => ({ 
        ...prev, 
        name: parsedProfile.name || "",
        phone: parsedProfile.phone || "",
        area: parsedProfile.district || "",
        state: parsedProfile.state || "",
        district: parsedProfile.district || "",
        farmSize: parsedProfile.farmSize || "",
        primaryCrops: parsedProfile.primaryCrops || []
      }))
    }
  }, [])

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
    
    // Clear validation error for this field
    if (validationErrors[key]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as any)
    handleSettingChange("voiceLanguage", newLanguage)
  }

  const handleCropChange = (crop: string, checked: boolean) => {
    const newCrops = checked 
      ? [...settings.primaryCrops, crop]
      : settings.primaryCrops.filter(c => c !== crop)
    handleSettingChange("primaryCrops", newCrops)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!settings.name.trim()) {
      errors.name = "Name is required"
    }
    
    if (settings.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(settings.phone)) {
      errors.phone = "Please enter a valid phone number"
    }
    
    if (settings.farmSize && isNaN(parseFloat(settings.farmSize))) {
      errors.farmSize = "Farm size must be a valid number"
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const saveSettings = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors before saving")
      return
    }

    setIsLoading(true)
    
    try {
    // Save settings to localStorage
    localStorage.setItem("app-settings", JSON.stringify(settings))
      
      // Save profile data separately
      const profileData = {
        name: settings.name,
        phone: settings.phone,
        state: settings.state,
        district: settings.district,
        farmSize: settings.farmSize,
        primaryCrops: settings.primaryCrops
      }
      localStorage.setItem("user-profile", JSON.stringify(profileData))
      
      // In a real app, you would also save to server
      // await fetch('/api/settings', { method: 'POST', body: JSON.stringify(settings) })
      
      setHasChanges(false)
      toast.success("Settings saved successfully!")
    } catch (error) {
      toast.error("Failed to save settings. Please try again.")
      console.error("Save error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetSettings = () => {
    const defaultSettings = {
      name: "",
      phone: "",
      area: "",
      state: "",
      district: "",
      farmSize: "",
      primaryCrops: [],
      enableVoice: true,
      enableTTS: true,
      voiceLanguage: "en" as any,
      speechRate: [0.9],
      enableNotifications: true,
      phoneNotifications: true,
      emailNotifications: false,
      weatherAlerts: true,
      pestAlerts: true,
      marketAlerts: true,
      priceAlerts: true,
      advisoryAlerts: true,
      emergencyAlerts: true,
      offlineMode: false,
      autoSync: true,
      dataUsage: "medium",
      dataSharing: false,
      analytics: true,
      crashReporting: true,
    }
    setSettings(defaultSettings)
    setLanguage("en")
    setHasChanges(true)
    setValidationErrors({})
    toast.info("Settings reset to default values")
  }

  const exportSettings = () => {
    const exportData = {
      settings,
      exportedAt: new Date().toISOString(),
      version: "2.0.0"
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `smart-crop-settings-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Settings exported successfully!")
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        if (importedData.settings) {
          setSettings(importedData.settings)
          setHasChanges(true)
          toast.success("Settings imported successfully!")
        } else {
          toast.error("Invalid settings file format")
        }
      } catch (error) {
        toast.error("Failed to import settings. Please check the file format.")
        console.error("Import error:", error)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-600 rounded-xl">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">{t("settings.title")}</h1>
            <p className="text-emerald-700">Customize your farming assistant experience</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {hasChanges && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
            <Badge variant={isOnline ? "default" : "secondary"} className="bg-emerald-100 text-emerald-800">
              {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
              {t(isOnline ? "common.online" : "common.offline")}
            </Badge>
          </div>
        </div>

        {/* Profile Settings */}
        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
            <CardTitle className="flex items-center gap-2 text-emerald-900">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Manage your personal and farming details</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => handleSettingChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className={validationErrors.name ? "border-red-500" : ""}
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleSettingChange("phone", e.target.value)}
                    placeholder="+91 9876543210"
                    className={validationErrors.phone ? "border-red-500" : ""}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="farmSize" className="text-sm font-medium text-gray-700">
                    Farm Size (acres)
                  </Label>
                  <Input
                    id="farmSize"
                    value={settings.farmSize}
                    onChange={(e) => handleSettingChange("farmSize", e.target.value)}
                    placeholder="5.2"
                    type="number"
                    step="0.1"
                    className={validationErrors.farmSize ? "border-red-500" : ""}
                  />
                  {validationErrors.farmSize && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.farmSize}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">State</Label>
                  <Select value={settings.state} onValueChange={(value) => handleSettingChange("state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="district" className="text-sm font-medium text-gray-700">
                    District/Area
                  </Label>
                  <Input
                    id="district"
                    value={settings.district}
                    onChange={(e) => handleSettingChange("district", e.target.value)}
                    placeholder="Ludhiana"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Primary Crops</Label>
                  <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-2">
                    {crops.slice(0, 12).map((crop) => (
                      <div key={crop} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={crop}
                          checked={settings.primaryCrops.includes(crop)}
                          onChange={(e) => handleCropChange(crop, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={crop} className="text-sm text-gray-700">
                          {crop}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {settings.primaryCrops.length} crops
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
            <CardTitle className="flex items-center gap-2 text-emerald-900">
              <Globe className="h-5 w-5" />
              {t("settings.language")}
            </CardTitle>
            <CardDescription>Choose your preferred language for the app interface</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Interface Language</label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-2">
                          <span>{lang.native}</span>
                          <span className="text-gray-500">({lang.name})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Settings */}
        {voiceSupported && (
          <Card className="border-emerald-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <Mic className="h-5 w-5" />
                {t("settings.voice")}
              </CardTitle>
              <CardDescription>Configure voice commands and text-to-speech</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">{t("settings.enableVoice")}</label>
                  <p className="text-xs text-gray-500">Allow voice commands for navigation</p>
                </div>
                <Switch
                  checked={settings.enableVoice}
                  onCheckedChange={(checked) => handleSettingChange("enableVoice", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">{t("settings.enableTTS")}</label>
                  <p className="text-xs text-gray-500">Read content aloud</p>
                </div>
                <Switch
                  checked={settings.enableTTS}
                  onCheckedChange={(checked) => handleSettingChange("enableTTS", checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t("settings.speechRate")}</label>
                <div className="px-3">
                  <Slider
                    value={settings.speechRate}
                    onValueChange={(value) => handleSettingChange("speechRate", value)}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slow</span>
                    <span>Normal</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notification Settings */}
        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
            <CardTitle className="flex items-center gap-2 text-emerald-900">
              <Bell className="h-5 w-5" />
              {t("settings.notifications")}
            </CardTitle>
            <CardDescription>Manage alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">{t("settings.enableNotifications")}</label>
                <p className="text-xs text-gray-500">Receive important farming alerts</p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => handleSettingChange("enableNotifications", checked)}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Notifications
                  </label>
                  <p className="text-xs text-gray-500">Receive SMS alerts on your phone</p>
                </div>
                <Switch
                  checked={settings.phoneNotifications}
                  onCheckedChange={(checked) => handleSettingChange("phoneNotifications", checked)}
                  disabled={!settings.enableNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                  <p className="text-xs text-gray-500">Receive alerts via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  disabled={!settings.enableNotifications}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Alert Types</h4>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">{t("settings.weatherAlerts")}</label>
                <Switch
                  checked={settings.weatherAlerts}
                  onCheckedChange={(checked) => handleSettingChange("weatherAlerts", checked)}
                  disabled={!settings.enableNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">{t("settings.pestAlerts")}</label>
                <Switch
                  checked={settings.pestAlerts}
                  onCheckedChange={(checked) => handleSettingChange("pestAlerts", checked)}
                  disabled={!settings.enableNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">{t("settings.marketAlerts")}</label>
                <Switch
                  checked={settings.marketAlerts}
                  onCheckedChange={(checked) => handleSettingChange("marketAlerts", checked)}
                  disabled={!settings.enableNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Price Alerts</label>
                <Switch
                  checked={settings.priceAlerts}
                  onCheckedChange={(checked) => handleSettingChange("priceAlerts", checked)}
                  disabled={!settings.enableNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Advisory Alerts</label>
                <Switch
                  checked={settings.advisoryAlerts}
                  onCheckedChange={(checked) => handleSettingChange("advisoryAlerts", checked)}
                  disabled={!settings.enableNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Emergency Alerts</label>
                <Switch
                  checked={settings.emergencyAlerts}
                  onCheckedChange={(checked) => handleSettingChange("emergencyAlerts", checked)}
                  disabled={!settings.enableNotifications}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offline & Data Settings */}
        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
            <CardTitle className="flex items-center gap-2 text-emerald-900">
              {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
              {t("settings.offline")}
            </CardTitle>
            <CardDescription>Configure offline mode and data synchronization</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">{t("settings.offlineMode")}</label>
                <p className="text-xs text-gray-500">Download data for offline access</p>
              </div>
              <Switch
                checked={settings.offlineMode}
                onCheckedChange={(checked) => handleSettingChange("offlineMode", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">{t("settings.autoSync")}</label>
                <p className="text-xs text-gray-500">Automatically sync when online</p>
              </div>
              <Switch
                checked={settings.autoSync}
                onCheckedChange={(checked) => handleSettingChange("autoSync", checked)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">{t("settings.dataUsage")}</label>
              <Select value={settings.dataUsage} onValueChange={(value) => handleSettingChange("dataUsage", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Text only</SelectItem>
                  <SelectItem value="medium">Medium - Text + Images</SelectItem>
                  <SelectItem value="high">High - All content</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
            <CardTitle className="flex items-center gap-2 text-emerald-900">
              <Shield className="h-5 w-5" />
              Privacy & Data
            </CardTitle>
            <CardDescription>Control your data sharing and privacy preferences</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Data Sharing</label>
                  <p className="text-xs text-gray-500">Allow anonymous usage data to improve the app</p>
                </div>
                <Switch
                  checked={settings.dataSharing}
                  onCheckedChange={(checked) => handleSettingChange("dataSharing", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Analytics</label>
                  <p className="text-xs text-gray-500">Help us understand app usage patterns</p>
                </div>
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={(checked) => handleSettingChange("analytics", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Crash Reporting</label>
                  <p className="text-xs text-gray-500">Automatically report crashes to help fix bugs</p>
                </div>
                <Switch
                  checked={settings.crashReporting}
                  onCheckedChange={(checked) => handleSettingChange("crashReporting", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Import/Export Settings */}
        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
            <CardTitle className="flex items-center gap-2 text-emerald-900">
              <Download className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>Import, export, or reset your settings</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Button
                  onClick={exportSettings}
                  variant="outline"
                  className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Settings
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Settings
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <h4 className="font-medium text-emerald-900 mb-2">App Version</h4>
                <p className="text-sm text-emerald-700">Smart Crop Advisory v2.0.0</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <h4 className="font-medium text-emerald-900 mb-2">Data Storage</h4>
                <p className="text-sm text-emerald-700">Local device only</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {hasChanges ? (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span>You have unsaved changes</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>All changes saved</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={resetSettings}
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
            <Button 
              onClick={saveSettings} 
              disabled={isLoading || !hasChanges}
              className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
            <Save className="h-4 w-4 mr-2" />
            {t("common.save")}
                </>
              )}
          </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
