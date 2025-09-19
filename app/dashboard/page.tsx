"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Leaf,
  Cloud,
  Bell,
  Settings,
  User,
  LogOut,
  Droplets,
  Thermometer,
  Wind,
  AlertTriangle,
  CheckCircle,
  Camera,
  BarChart3,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAlerts } from "@/contexts/alerts-context"
import { LanguageSelector } from "@/components/language-selector"
import { AutoTTSButton } from "@/components/auto-tts-button"
import { useAutoTTS } from "@/hooks/use-auto-tts"
import { motion } from "framer-motion"

interface WeatherData {
  location: {
    name: string
    country: string
  }
  current: {
    temperature: number
    humidity: number
    windSpeed: number
    description: string
    cloudiness: number
  }
  farming: {
    soilMoisture: string
    irrigationAdvice: string
    pestRisk: string
    fieldWorkSuitability: string
  }
}

interface MarketData {
  crops: {
    [key: string]: {
      name: string
      currentPrice: number
      unit: string
      change: number
      trend: string
    }
  }
  insights: Array<{
    type: string
    crop: string
    message: string
    priority: string
  }>
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const { alerts, unreadCount } = useAlerts()
  const { speakPageTitle, speakOnHover, speakButtonAction, autoTTSEnabled } = useAutoTTS()

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [isLoadingWeather, setIsLoadingWeather] = useState(true)
  const [isLoadingMarket, setIsLoadingMarket] = useState(true)

  const [cropStatus] = useState([
    { crop: "Wheat", stage: "Flowering", health: 85, nextAction: "Apply fertilizer" },
    { crop: "Rice", stage: "Vegetative", health: 92, nextAction: "Monitor water levels" },
    { crop: "Cotton", stage: "Maturity", health: 78, nextAction: "Prepare for harvest" },
  ])

  useEffect(() => {
    speakPageTitle("Dashboard")
  }, [speakPageTitle])

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch("/api/weather?city=Ludhiana,IN")
        if (response.ok) {
          const data = await response.json()
          setWeatherData(data)
        }
      } catch (error) {
        console.error("Failed to fetch weather data:", error)
      } finally {
        setIsLoadingWeather(false)
      }
    }

    const fetchMarketData = async () => {
      try {
        const response = await fetch("/api/market")
        if (response.ok) {
          const data = await response.json()
          setMarketData(data)
        }
      } catch (error) {
        console.error("Failed to fetch market data:", error)
      } finally {
        setIsLoadingMarket(false)
      }
    }

    fetchWeatherData()
    fetchMarketData()
  }, [])

  const topMarketInsights = marketData?.insights.slice(0, 2) || []
  const topCrops = marketData ? Object.entries(marketData.crops).slice(0, 3) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-yellow-50">
      <header className="bg-white/90 backdrop-blur-md border-b border-emerald-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              {t("app.title")}
            </h1>
          </motion.div>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <AutoTTSButton />
            <Link href="/alerts">
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 transition-all duration-200 hover:scale-105"
                onMouseEnter={() => autoTTSEnabled && speakOnHover(`${t("dashboard.alerts")} - ${unreadCount} unread`)}
                onClick={() => speakButtonAction(t("dashboard.alerts"))}
              >
                <Bell className="h-4 w-4 mr-2" />
                {t("dashboard.alerts")}
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2 bg-red-500 animate-pulse">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/settings">
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 transition-all duration-200 hover:scale-105"
                onMouseEnter={() => autoTTSEnabled && speakOnHover(t("nav.settings"))}
                onClick={() => speakButtonAction(t("nav.settings"))}
              >
                <Settings className="h-4 w-4 mr-2" />
                {t("nav.settings")}
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 transition-all duration-200 hover:scale-105"
                onMouseEnter={() => autoTTSEnabled && speakOnHover(t("nav.profile"))}
                onClick={() => speakButtonAction(t("nav.profile"))}
              >
                <User className="h-4 w-4 mr-2" />
                {t("nav.profile")}
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 transition-all duration-200 hover:scale-105"
                onMouseEnter={() => autoTTSEnabled && speakOnHover(t("nav.logout"))}
                onClick={() => speakButtonAction(t("nav.logout"))}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("nav.logout")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-4xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-2"
            onMouseEnter={() => autoTTSEnabled && speakOnHover(`${t("dashboard.welcome")}, Farmer!`)}
          >
            {t("dashboard.welcome")}, Farmer!
          </h2>
          <p
            className="text-emerald-700 text-lg"
            onMouseEnter={() =>
              autoTTSEnabled &&
              speakOnHover(
                weatherData
                  ? `${weatherData.location.name} - ${weatherData.current.description}`
                  : "Loading your farm overview...",
              )
            }
          >
            {weatherData
              ? `${weatherData.location.name} - ${weatherData.current.description}`
              : "Loading your farm overview..."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card
              className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-emerald-300"
              onMouseEnter={() =>
                autoTTSEnabled &&
                speakOnHover(`${t("dashboard.temperature")}: ${weatherData?.current.temperature || 0} degrees celsius`)
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700">{t("dashboard.temperature")}</CardTitle>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingWeather ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    <span className="text-sm text-emerald-600">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-emerald-900">{weatherData?.current.temperature || 0}°C</div>
                    <p className="text-xs text-emerald-600">{weatherData?.current.description || "N/A"}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card
              className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-emerald-300"
              onMouseEnter={() =>
                autoTTSEnabled &&
                speakOnHover(`${t("dashboard.humidity")}: ${weatherData?.current.humidity || 0} percent`)
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700">{t("dashboard.humidity")}</CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Droplets className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingWeather ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    <span className="text-sm text-emerald-600">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-emerald-900">{weatherData?.current.humidity || 0}%</div>
                    <p className="text-xs text-emerald-600">Soil: {weatherData?.farming.soilMoisture || "N/A"}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card
              className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-emerald-300"
              onMouseEnter={() =>
                autoTTSEnabled &&
                speakOnHover(`${t("dashboard.wind")}: ${weatherData?.current.windSpeed || 0} meters per second`)
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700">{t("dashboard.wind")}</CardTitle>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Wind className="h-4 w-4 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingWeather ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    <span className="text-sm text-emerald-600">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-emerald-900">{weatherData?.current.windSpeed || 0} m/s</div>
                    <p className="text-xs text-emerald-600">{weatherData?.farming.fieldWorkSuitability || "N/A"}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card
              className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-emerald-300"
              onMouseEnter={() =>
                autoTTSEnabled && speakOnHover(`Pest Risk: ${weatherData?.farming.pestRisk || "Monitor regularly"}`)
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700">Pest Risk</CardTitle>
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingWeather ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    <span className="text-sm text-emerald-600">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-lg font-bold text-emerald-900">
                      {weatherData?.farming.pestRisk?.split(" - ")[0] || "N/A"}
                    </div>
                    <p className="text-xs text-emerald-600">
                      {weatherData?.farming.pestRisk?.split(" - ")[1] || "Monitor regularly"}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle
                    className="text-emerald-800 flex items-center gap-2 text-xl"
                    onMouseEnter={() => autoTTSEnabled && speakOnHover(t("dashboard.alerts"))}
                  >
                    <Bell className="h-5 w-5" />
                    {t("dashboard.alerts")}
                  </CardTitle>
                  <CardDescription className="text-emerald-600">Important notifications for your farm</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alerts.slice(0, 3).map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                        alert.severity === "critical"
                          ? "bg-red-50 border-red-200 hover:bg-red-100"
                          : alert.severity === "high"
                            ? "bg-orange-50 border-orange-200 hover:bg-orange-100"
                            : alert.severity === "medium"
                              ? "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                              : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                      }`}
                      onMouseEnter={() => autoTTSEnabled && speakOnHover(`${alert.severity} alert: ${alert.message}`)}
                    >
                      <AlertTriangle
                        className={`h-5 w-5 ${
                          alert.severity === "critical"
                            ? "text-red-500"
                            : alert.severity === "high"
                              ? "text-orange-500"
                              : alert.severity === "medium"
                                ? "text-yellow-500"
                                : "text-blue-500"
                        }`}
                      />
                      <span className="flex-1 text-sm text-gray-700 font-medium">{alert.message}</span>
                      <Badge
                        variant={
                          alert.severity === "critical" || alert.severity === "high" ? "destructive" : "secondary"
                        }
                        className={`${
                          alert.severity === "critical"
                            ? "bg-red-500"
                            : alert.severity === "high"
                              ? "bg-orange-500"
                              : alert.severity === "medium"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                        } text-white`}
                      >
                        {alert.severity}
                      </Badge>
                    </motion.div>
                  ))}
                  {alerts.length > 3 && (
                    <Link href="/alerts">
                      <Button
                        variant="outline"
                        className="w-full mt-3 border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                        onMouseEnter={() => autoTTSEnabled && speakOnHover(`View All Alerts - ${alerts.length} total`)}
                        onClick={() => speakButtonAction("View All Alerts")}
                      >
                        View All Alerts ({alerts.length})
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-emerald-800 flex items-center gap-2 text-xl">
                    <BarChart3 className="h-5 w-5" />
                    Market Insights
                  </CardTitle>
                  <CardDescription className="text-emerald-600">Latest crop prices and market trends</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMarket ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mr-2" />
                      <span className="text-emerald-600">Loading market data...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {topCrops.map(([cropKey, crop]) => (
                          <div key={cropKey} className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-emerald-800">{crop.name}</span>
                              <div className="flex items-center gap-1">
                                {crop.trend === "up" ? (
                                  <TrendingUp className="h-3 w-3 text-green-500" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 text-red-500" />
                                )}
                                <span className={`text-xs ${crop.change > 0 ? "text-green-600" : "text-red-600"}`}>
                                  {crop.change > 0 ? "+" : ""}
                                  {crop.change}%
                                </span>
                              </div>
                            </div>
                            <div className="text-lg font-bold text-emerald-900">₹{crop.currentPrice}</div>
                            <div className="text-xs text-emerald-600">{crop.unit}</div>
                          </div>
                        ))}
                      </div>

                      {topMarketInsights.length > 0 && (
                        <div className="space-y-2 mt-4">
                          {topMarketInsights.map((insight, index) => (
                            <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <p className="text-sm text-blue-800 font-medium">{insight.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle
                    className="text-emerald-800 flex items-center gap-2 text-xl"
                    onMouseEnter={() => autoTTSEnabled && speakOnHover(t("dashboard.cropStatus"))}
                  >
                    <Leaf className="h-5 w-5" />
                    {t("dashboard.cropStatus")}
                  </CardTitle>
                  <CardDescription className="text-emerald-600">Monitor your crop health and progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cropStatus.map((crop, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 hover:shadow-md transition-all duration-200"
                      onMouseEnter={() =>
                        autoTTSEnabled &&
                        speakOnHover(
                          `${crop.crop} - ${crop.stage} stage - ${crop.health} percent health - Next action: ${crop.nextAction}`,
                        )
                      }
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-emerald-800 text-lg">{crop.crop}</h4>
                          <p className="text-sm text-emerald-600">{crop.stage} stage</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-900">{crop.health}%</div>
                          <p className="text-xs text-emerald-600">Health</p>
                        </div>
                      </div>
                      <Progress value={crop.health} className="h-3 mb-3" />
                      <p className="text-sm text-emerald-700 bg-white/60 p-2 rounded-lg">
                        <strong>Next action:</strong> {crop.nextAction}
                      </p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle
                    className="text-emerald-800 text-xl"
                    onMouseEnter={() => autoTTSEnabled && speakOnHover(t("dashboard.quickActions"))}
                  >
                    {t("dashboard.quickActions")}
                  </CardTitle>
                  <CardDescription className="text-emerald-600">Access key features instantly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/crop-advisory">
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-4 h-auto"
                      onMouseEnter={() =>
                        autoTTSEnabled && speakOnHover(`${t("nav.cropAdvisory")} - Get personalized advice`)
                      }
                      onClick={() => speakButtonAction(t("nav.cropAdvisory"))}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Leaf className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{t("nav.cropAdvisory")}</div>
                          <div className="text-xs opacity-90">Get personalized advice</div>
                        </div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/weather">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-blue-300 text-blue-700 hover:bg-blue-50 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-4 h-auto"
                      onMouseEnter={() => autoTTSEnabled && speakOnHover(`${t("nav.weather")} - 7-day forecast`)}
                      onClick={() => speakButtonAction(t("nav.weather"))}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Cloud className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{t("nav.weather")}</div>
                          <div className="text-xs opacity-70">7-day forecast</div>
                        </div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/pest-detection">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-orange-300 text-orange-700 hover:bg-orange-50 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-4 h-auto"
                      onMouseEnter={() =>
                        autoTTSEnabled && speakOnHover(`${t("nav.pestDetection")} - AI-powered detection`)
                      }
                      onClick={() => speakButtonAction(t("nav.pestDetection"))}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Camera className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{t("nav.pestDetection")}</div>
                          <div className="text-xs opacity-70">AI-powered detection</div>
                        </div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/market-prices">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-green-300 text-green-700 hover:bg-green-50 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-4 h-auto"
                      onMouseEnter={() =>
                        autoTTSEnabled && speakOnHover(`${t("nav.marketPrices")} - Live price tracking`)
                      }
                      onClick={() => speakButtonAction(t("nav.marketPrices"))}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <BarChart3 className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{t("nav.marketPrices")}</div>
                          <div className="text-xs opacity-70">Live price tracking</div>
                        </div>
                      </div>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-emerald-800 text-xl">{t("dashboard.tasks")}</CardTitle>
                  <CardDescription className="text-emerald-600">Recommended actions for today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700 line-through">Check irrigation system</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer">
                    <div className="h-5 w-5 rounded-full border-2 border-emerald-400" />
                    <span className="text-sm text-gray-700 font-medium">
                      {weatherData?.farming.irrigationAdvice || "Apply fertilizer to wheat field"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer">
                    <div className="h-5 w-5 rounded-full border-2 border-emerald-400" />
                    <span className="text-sm text-gray-700 font-medium">Monitor pest activity</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer">
                    <div className="h-5 w-5 rounded-full border-2 border-emerald-400" />
                    <span className="text-sm text-gray-700 font-medium">Check market prices</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Farm Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-emerald-800 text-xl">Farm Statistics</CardTitle>
                  <CardDescription className="text-emerald-600">This month's overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-sm text-emerald-700 font-medium">Total Area</span>
                    <span className="font-bold text-emerald-900 text-lg">5.2 acres</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-sm text-emerald-700 font-medium">Crops Planted</span>
                    <span className="font-bold text-emerald-900 text-lg">3 varieties</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-sm text-emerald-700 font-medium">Expected Yield</span>
                    <span className="font-bold text-emerald-900 text-lg">12.5 tons</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-sm text-emerald-700 font-medium">Investment</span>
                    <span className="font-bold text-emerald-900 text-lg">₹45,000</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
