import { type NextRequest, NextResponse } from "next/server"

// Settings API for server-side persistence
// In a real app, this would connect to a database

interface UserSettings {
  userId?: string
  name: string
  phone: string
  area: string
  state: string
  district: string
  farmSize: string
  primaryCrops: string[]
  enableVoice: boolean
  enableTTS: boolean
  voiceLanguage: string
  speechRate: number[]
  enableNotifications: boolean
  phoneNotifications: boolean
  emailNotifications: boolean
  weatherAlerts: boolean
  pestAlerts: boolean
  marketAlerts: boolean
  priceAlerts: boolean
  advisoryAlerts: boolean
  emergencyAlerts: boolean
  offlineMode: boolean
  autoSync: boolean
  dataUsage: string
  dataSharing: boolean
  analytics: boolean
  crashReporting: boolean
  lastUpdated: string
}

// Mock storage (in real app, use database)
let settingsStorage: Record<string, UserSettings> = {}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId") || "default"

  try {
    const userSettings = settingsStorage[userId]
    
    if (!userSettings) {
      return NextResponse.json({ 
        message: "No settings found for user",
        settings: null 
      })
    }

    return NextResponse.json({
      settings: userSettings,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Settings GET error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = "default", settings } = body

    if (!settings) {
      return NextResponse.json({ error: "Settings data is required" }, { status: 400 })
    }

    // Validate required fields
    const validationErrors: Record<string, string> = {}
    
    if (!settings.name?.trim()) {
      validationErrors.name = "Name is required"
    }
    
    if (settings.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(settings.phone)) {
      validationErrors.phone = "Please enter a valid phone number"
    }
    
    if (settings.farmSize && isNaN(parseFloat(settings.farmSize))) {
      validationErrors.farmSize = "Farm size must be a valid number"
    }

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json({ 
        error: "Validation failed", 
        validationErrors 
      }, { status: 400 })
    }

    // Prepare settings data
    const settingsData: UserSettings = {
      userId,
      name: settings.name || "",
      phone: settings.phone || "",
      area: settings.area || "",
      state: settings.state || "",
      district: settings.district || "",
      farmSize: settings.farmSize || "",
      primaryCrops: settings.primaryCrops || [],
      enableVoice: settings.enableVoice ?? true,
      enableTTS: settings.enableTTS ?? true,
      voiceLanguage: settings.voiceLanguage || "en",
      speechRate: settings.speechRate || [0.9],
      enableNotifications: settings.enableNotifications ?? true,
      phoneNotifications: settings.phoneNotifications ?? true,
      emailNotifications: settings.emailNotifications ?? false,
      weatherAlerts: settings.weatherAlerts ?? true,
      pestAlerts: settings.pestAlerts ?? true,
      marketAlerts: settings.marketAlerts ?? true,
      priceAlerts: settings.priceAlerts ?? true,
      advisoryAlerts: settings.advisoryAlerts ?? true,
      emergencyAlerts: settings.emergencyAlerts ?? true,
      offlineMode: settings.offlineMode ?? false,
      autoSync: settings.autoSync ?? true,
      dataUsage: settings.dataUsage || "medium",
      dataSharing: settings.dataSharing ?? false,
      analytics: settings.analytics ?? true,
      crashReporting: settings.crashReporting ?? true,
      lastUpdated: new Date().toISOString()
    }

    // Save to storage
    settingsStorage[userId] = settingsData

    // In a real app, you would save to database here
    // await db.settings.upsert({ where: { userId }, data: settingsData })

    return NextResponse.json({
      message: "Settings saved successfully",
      settings: settingsData,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Settings POST error:", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = "default", updates } = body

    if (!updates) {
      return NextResponse.json({ error: "Updates data is required" }, { status: 400 })
    }

    const existingSettings = settingsStorage[userId]
    if (!existingSettings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 })
    }

    // Merge updates with existing settings
    const updatedSettings = {
      ...existingSettings,
      ...updates,
      lastUpdated: new Date().toISOString()
    }

    settingsStorage[userId] = updatedSettings

    return NextResponse.json({
      message: "Settings updated successfully",
      settings: updatedSettings,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Settings PUT error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId") || "default"

    if (!settingsStorage[userId]) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 })
    }

    delete settingsStorage[userId]

    return NextResponse.json({
      message: "Settings deleted successfully",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Settings DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete settings" }, { status: 500 })
  }
}
