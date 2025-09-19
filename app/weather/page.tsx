"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Cloud,
  ArrowLeft,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react"
import { AutoTTSButton } from "@/components/auto-tts-button"
import { useAutoTTS } from "@/hooks/use-auto-tts"

export default function WeatherPage() {
  const { speakPageTitle, speakOnHover, speakButtonAction, autoTTSEnabled } = useAutoTTS()

  const [currentWeather, setCurrentWeather] = useState({
    location: "Ludhiana, Punjab",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    visibility: 10,
    uvIndex: 6,
    rainfall: 2.5,
    feelsLike: 31,
  })

  const [forecast, setForecast] = useState([
    {
      date: "Today",
      day: "Mon",
      high: 32,
      low: 22,
      condition: "Partly Cloudy",
      icon: "partly-cloudy",
      precipitation: 20,
      humidity: 65,
    },
    {
      date: "Tomorrow",
      day: "Tue",
      high: 29,
      low: 20,
      condition: "Rainy",
      icon: "rainy",
      precipitation: 80,
      humidity: 85,
    },
    {
      date: "Wed",
      day: "Wed",
      high: 26,
      low: 18,
      condition: "Heavy Rain",
      icon: "heavy-rain",
      precipitation: 95,
      humidity: 90,
    },
    {
      date: "Thu",
      day: "Thu",
      high: 30,
      low: 21,
      condition: "Cloudy",
      icon: "cloudy",
      precipitation: 40,
      humidity: 70,
    },
    {
      date: "Fri",
      day: "Fri",
      high: 33,
      low: 24,
      condition: "Sunny",
      icon: "sunny",
      precipitation: 10,
      humidity: 55,
    },
    {
      date: "Sat",
      day: "Sat",
      high: 35,
      low: 26,
      condition: "Hot",
      icon: "hot",
      precipitation: 5,
      humidity: 45,
    },
    {
      date: "Sun",
      day: "Sun",
      high: 31,
      low: 23,
      condition: "Partly Cloudy",
      icon: "partly-cloudy",
      precipitation: 25,
      humidity: 60,
    },
  ])

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "warning",
      title: "Heavy Rainfall Alert",
      message: "Heavy rainfall expected in next 48 hours. Prepare drainage systems.",
      severity: "high",
      validUntil: "2024-01-15",
    },
    {
      id: 2,
      type: "advisory",
      title: "High Humidity",
      message: "High humidity levels may increase fungal disease risk in crops.",
      severity: "medium",
      validUntil: "2024-01-12",
    },
    {
      id: 3,
      type: "info",
      title: "Favorable Conditions",
      message: "Good weather conditions for pesticide application after Wednesday.",
      severity: "low",
      validUntil: "2024-01-18",
    },
  ])

  const [farmingAdvice, setFarmingAdvice] = useState([
    {
      activity: "Irrigation",
      recommendation: "Reduce irrigation due to expected rainfall",
      priority: "high",
      timing: "Next 2 days",
    },
    {
      activity: "Fertilizer Application",
      recommendation: "Postpone fertilizer application until after rain",
      priority: "medium",
      timing: "After Wednesday",
    },
    {
      activity: "Pest Control",
      recommendation: "Apply fungicides before rain to prevent diseases",
      priority: "high",
      timing: "Today",
    },
    {
      activity: "Harvesting",
      recommendation: "Complete harvesting of mature crops before rain",
      priority: "high",
      timing: "Immediate",
    },
  ])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
      case "hot":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "partly cloudy":
        return <Cloud className="h-8 w-8 text-gray-400" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "rainy":
      case "heavy rain":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  useEffect(() => {
    speakPageTitle("Weather Forecast")
  }, [speakPageTitle])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
              onMouseEnter={() => autoTTSEnabled && speakOnHover("Back to Dashboard")}
              onClick={() => speakButtonAction("Back to Dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-blue-600" />
            <h1
              className="text-xl font-bold text-blue-800"
              onMouseEnter={() => autoTTSEnabled && speakOnHover("Weather Forecast")}
            >
              Weather Forecast
            </h1>
          </div>
          <div className="ml-auto">
            <AutoTTSButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2
              className="text-3xl font-bold text-blue-900 mb-2"
              onMouseEnter={() => autoTTSEnabled && speakOnHover("Weather Dashboard")}
            >
              Weather Dashboard
            </h2>
            <p
              className="text-blue-700"
              onMouseEnter={() =>
                autoTTSEnabled && speakOnHover("Real-time weather updates and farming recommendations")
              }
            >
              Real-time weather updates and farming recommendations
            </p>
          </div>

          {/* Current Weather */}
          <Card
            className="bg-white/70 backdrop-blur-sm border-blue-200 mb-8"
            onMouseEnter={() =>
              autoTTSEnabled &&
              speakOnHover(
                `Current weather in ${currentWeather.location}: ${currentWeather.temperature} degrees celsius, ${currentWeather.condition}`,
              )
            }
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-blue-800">{currentWeather.location}</CardTitle>
                  <CardDescription className="text-blue-600">Current Weather Conditions</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-900">{currentWeather.temperature}°C</div>
                  <p className="text-blue-600">{currentWeather.condition}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div
                  className="flex items-center gap-2"
                  onMouseEnter={() =>
                    autoTTSEnabled && speakOnHover(`Feels like ${currentWeather.feelsLike} degrees celsius`)
                  }
                >
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-xs text-blue-600">Feels Like</p>
                    <p className="font-semibold text-blue-900">{currentWeather.feelsLike}°C</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2"
                  onMouseEnter={() => autoTTSEnabled && speakOnHover(`Humidity ${currentWeather.humidity} percent`)}
                >
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-blue-600">Humidity</p>
                    <p className="font-semibold text-blue-900">{currentWeather.humidity}%</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2"
                  onMouseEnter={() =>
                    autoTTSEnabled && speakOnHover(`Wind speed ${currentWeather.windSpeed} kilometers per hour`)
                  }
                >
                  <Wind className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-blue-600">Wind Speed</p>
                    <p className="font-semibold text-blue-900">{currentWeather.windSpeed} km/h</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2"
                  onMouseEnter={() => autoTTSEnabled && speakOnHover(`Pressure ${currentWeather.pressure} millibars`)}
                >
                  <Gauge className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-xs text-blue-600">Pressure</p>
                    <p className="font-semibold text-blue-900">{currentWeather.pressure} mb</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2"
                  onMouseEnter={() =>
                    autoTTSEnabled && speakOnHover(`Visibility ${currentWeather.visibility} kilometers`)
                  }
                >
                  <Eye className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-blue-600">Visibility</p>
                    <p className="font-semibold text-blue-900">{currentWeather.visibility} km</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2"
                  onMouseEnter={() => autoTTSEnabled && speakOnHover(`UV Index ${currentWeather.uvIndex}`)}
                >
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-xs text-blue-600">UV Index</p>
                    <p className="font-semibold text-blue-900">{currentWeather.uvIndex}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="forecast" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/70 border border-blue-200">
              <TabsTrigger
                value="forecast"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                onMouseEnter={() => autoTTSEnabled && speakOnHover("7-Day Forecast")}
                onClick={() => speakButtonAction("7-Day Forecast")}
              >
                7-Day Forecast
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                onMouseEnter={() => autoTTSEnabled && speakOnHover("Weather Alerts")}
                onClick={() => speakButtonAction("Weather Alerts")}
              >
                Weather Alerts
              </TabsTrigger>
              <TabsTrigger
                value="farming"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                onMouseEnter={() => autoTTSEnabled && speakOnHover("Farming Advice")}
                onClick={() => speakButtonAction("Farming Advice")}
              >
                Farming Advice
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forecast" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {forecast.map((day, index) => (
                  <Card
                    key={index}
                    className={`bg-white/70 backdrop-blur-sm border-blue-200 ${
                      index === 0 ? "ring-2 ring-blue-400" : ""
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-sm text-blue-800">{day.date}</CardTitle>
                          <CardDescription className="text-xs text-blue-600">{day.day}</CardDescription>
                        </div>
                        {getWeatherIcon(day.condition)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 text-red-500" />
                          <span className="text-sm font-semibold text-blue-900">{day.high}°</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-3 w-3 text-blue-500" />
                          <span className="text-sm text-blue-700">{day.low}°</span>
                        </div>
                      </div>
                      <p className="text-xs text-blue-600">{day.condition}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-blue-600">Rain Chance</span>
                          <span className="text-blue-900">{day.precipitation}%</span>
                        </div>
                        <Progress value={day.precipitation} className="h-1" />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-600">Humidity</span>
                        <span className="text-blue-900">{day.humidity}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <Card
                    key={alert.id}
                    className={`bg-white/70 backdrop-blur-sm border-l-4 ${
                      alert.severity === "high"
                        ? "border-l-red-500"
                        : alert.severity === "medium"
                          ? "border-l-yellow-500"
                          : "border-l-blue-500"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              alert.severity === "high"
                                ? "text-red-500"
                                : alert.severity === "medium"
                                  ? "text-yellow-500"
                                  : "text-blue-500"
                            }`}
                          />
                          <div>
                            <CardTitle className="text-blue-800">{alert.title}</CardTitle>
                            <CardDescription className="text-blue-600">Valid until {alert.validUntil}</CardDescription>
                          </div>
                        </div>
                        <Badge
                          className={
                            alert.severity === "high"
                              ? "bg-red-500"
                              : alert.severity === "medium"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-blue-700">{alert.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="farming" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {farmingAdvice.map((advice, index) => (
                  <Card key={index} className="bg-white/70 backdrop-blur-sm border-blue-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-blue-800 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {advice.activity}
                        </CardTitle>
                        <Badge className={getPriorityColor(advice.priority)}>{advice.priority}</Badge>
                      </div>
                      <CardDescription className="text-blue-600">Timing: {advice.timing}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-blue-700">{advice.recommendation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Weather-Based Farming Tips</CardTitle>
                  <CardDescription className="text-blue-600">
                    General recommendations based on current conditions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-800">Before Rain (Next 48 hours)</h4>
                      <ul className="space-y-1 text-sm text-blue-700">
                        <li>• Complete harvesting of ready crops</li>
                        <li>• Apply preventive fungicides</li>
                        <li>• Ensure proper drainage systems</li>
                        <li>• Store farm equipment safely</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-800">After Rain (Post Wednesday)</h4>
                      <ul className="space-y-1 text-sm text-blue-700">
                        <li>• Resume fertilizer applications</li>
                        <li>• Check for waterlogging issues</li>
                        <li>• Monitor for pest and disease outbreaks</li>
                        <li>• Plan next sowing activities</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
