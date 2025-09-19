"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { useAlerts, type Alert } from "@/contexts/alerts-context"
import {
  Bell,
  BellRing,
  Cloud,
  Bug,
  TrendingUp,
  Droplets,
  Leaf,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  X,
  AlertTriangle,
  Info,
  Zap,
} from "lucide-react"

export default function AlertsPage() {
  const { t } = useLanguage()
  const { alerts, unreadCount, markAsRead, markAllAsRead, dismissAlert, getAlertsByType, getActiveAlerts } = useAlerts()
  const [selectedTab, setSelectedTab] = useState("active")

  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: Alert["type"]) => {
    switch (type) {
      case "weather":
        return <Cloud className="h-4 w-4" />
      case "pest":
        return <Bug className="h-4 w-4" />
      case "market":
        return <TrendingUp className="h-4 w-4" />
      case "irrigation":
        return <Droplets className="h-4 w-4" />
      case "fertilizer":
        return <Leaf className="h-4 w-4" />
      case "harvest":
        return <Calendar className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getSeverityIcon = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return <Zap className="h-4 w-4 text-red-600" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "medium":
        return <Info className="h-4 w-4 text-yellow-600" />
      case "low":
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  const AlertCard = ({ alert }: { alert: Alert }) => (
    <Card
      className={`border-l-4 ${alert.isRead ? "opacity-75" : ""} ${
        alert.severity === "critical"
          ? "border-l-red-500"
          : alert.severity === "high"
            ? "border-l-orange-500"
            : alert.severity === "medium"
              ? "border-l-yellow-500"
              : "border-l-blue-500"
      } hover:shadow-md transition-shadow`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`p-2 rounded-lg ${
                alert.type === "weather"
                  ? "bg-blue-100"
                  : alert.type === "pest"
                    ? "bg-red-100"
                    : alert.type === "market"
                      ? "bg-green-100"
                      : alert.type === "irrigation"
                        ? "bg-cyan-100"
                        : alert.type === "fertilizer"
                          ? "bg-emerald-100"
                          : "bg-purple-100"
              }`}
            >
              {getTypeIcon(alert.type)}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                {alert.actionRequired && (
                  <Badge variant="outline" className="border-emerald-600 text-emerald-600">
                    Action Required
                  </Badge>
                )}
              </div>

              <p className="text-gray-700 mb-3">{alert.message}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(alert.timestamp)}
                </div>
                {alert.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {alert.location}
                  </div>
                )}
                {alert.cropType && (
                  <div className="flex items-center gap-1">
                    <Leaf className="h-3 w-3" />
                    {alert.cropType}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {getSeverityIcon(alert.severity)}
            {!alert.isRead && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => markAsRead(alert.id)}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => dismissAlert(alert.id)}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const activeAlerts = getActiveAlerts()
  const weatherAlerts = getAlertsByType("weather")
  const pestAlerts = getAlertsByType("pest")
  const marketAlerts = getAlertsByType("market")
  const irrigationAlerts = getAlertsByType("irrigation")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 rounded-xl relative">
              <Bell className="h-6 w-6 text-white" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-emerald-900">{t("alerts.title")}</h1>
              <p className="text-emerald-700">Stay informed about your farming operations</p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read ({unreadCount})
            </Button>
          )}
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold text-emerald-900">{activeAlerts.length}</p>
                  <p className="text-sm text-emerald-700">Active Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">{weatherAlerts.length}</p>
                  <p className="text-sm text-blue-700">Weather</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-900">{pestAlerts.length}</p>
                  <p className="text-sm text-red-700">Pest Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">{marketAlerts.length}</p>
                  <p className="text-sm text-green-700">Market</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white border border-emerald-200">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
            >
              {t("alerts.active")}
            </TabsTrigger>
            <TabsTrigger value="weather" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
              {t("alerts.weather")}
            </TabsTrigger>
            <TabsTrigger value="pest" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">
              {t("alerts.pest")}
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
              {t("alerts.market")}
            </TabsTrigger>
            <TabsTrigger
              value="irrigation"
              className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-900"
            >
              Irrigation
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
              {t("alerts.history")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeAlerts.length > 0 ? (
              activeAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-emerald-900 mb-2">No Active Alerts</h3>
                  <p className="text-emerald-700">All caught up! No urgent alerts at the moment.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="weather" className="space-y-4">
            {weatherAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </TabsContent>

          <TabsContent value="pest" className="space-y-4">
            {pestAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            {marketAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </TabsContent>

          <TabsContent value="irrigation" className="space-y-4">
            {irrigationAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
