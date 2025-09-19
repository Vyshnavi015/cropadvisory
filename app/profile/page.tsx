"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import {
  User,
  Wheat,
  Calendar,
  BarChart3,
  Download,
  Upload,
  Wifi,
  WifiOff,
  Edit,
  LogOut,
  Trash2,
  Save,
} from "lucide-react"

export default function ProfilePage() {
  const { t, isOnline } = useLanguage()

  // Profile state
  const [profile, setProfile] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91 9876543210",
    state: "Punjab",
    district: "Ludhiana",
    farmSize: "5.2",
    experience: "12",
    primaryCrops: ["Wheat", "Rice", "Cotton"],
    language: "hi",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)

  // Usage statistics
  const stats = {
    totalQueries: 247,
    dataDownloaded: "1.2 GB",
    lastSync: "2 hours ago",
    offlineDataSize: "450 MB",
    weatherChecks: 89,
    pestDetections: 23,
    marketQueries: 67,
    advisoryRequests: 68,
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedProfile(profile)
  }

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
    // Save to localStorage or API
    localStorage.setItem("user-profile", JSON.stringify(editedProfile))
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem("user-profile")
    localStorage.removeItem("app-settings")
    window.location.href = "/login"
  }

  const downloadData = () => {
    // Simulate data download
    const data = {
      profile,
      stats,
      settings: JSON.parse(localStorage.getItem("app-settings") || "{}"),
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "smart-crop-data.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-600 rounded-xl">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">{t("profile.title")}</h1>
            <p className="text-emerald-700">Manage your account and farming information</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant={isOnline ? "default" : "secondary"} className="bg-emerald-100 text-emerald-800">
              {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
              {t(isOnline ? "common.online" : "common.offline")}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-emerald-200">
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
            >
              {t("profile.personalInfo")}
            </TabsTrigger>
            <TabsTrigger
              value="farm"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
            >
              {t("profile.farmDetails")}
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
            >
              {t("profile.statistics")}
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
            >
              {t("profile.dataManagement")}
            </TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-emerald-900">{t("profile.personalInfo")}</CardTitle>
                    <CardDescription>Your basic account information</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {t("profile.editProfile")}
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        {t("common.cancel")}
                      </Button>
                      <Button onClick={handleSave} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        <Save className="h-4 w-4 mr-2" />
                        {t("common.save")}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t("auth.name")}</label>
                    <Input
                      value={isEditing ? editedProfile.name : profile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t("auth.email")}</label>
                    <Input
                      value={isEditing ? editedProfile.email : profile.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t("auth.phone")}</label>
                    <Input
                      value={isEditing ? editedProfile.phone : profile.phone}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      {t("profile.experience")} (years)
                    </label>
                    <Input
                      value={isEditing ? editedProfile.experience : profile.experience}
                      onChange={(e) => setEditedProfile({ ...editedProfile, experience: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farm Details */}
          <TabsContent value="farm">
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                <CardTitle className="flex items-center gap-2 text-emerald-900">
                  <Wheat className="h-5 w-5" />
                  {t("profile.farmDetails")}
                </CardTitle>
                <CardDescription>Information about your farming operations</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t("auth.state")}</label>
                    <Input
                      value={isEditing ? editedProfile.state : profile.state}
                      onChange={(e) => setEditedProfile({ ...editedProfile, state: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t("auth.district")}</label>
                    <Input
                      value={isEditing ? editedProfile.district : profile.district}
                      onChange={(e) => setEditedProfile({ ...editedProfile, district: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t("auth.farmSize")}</label>
                    <Input
                      value={isEditing ? editedProfile.farmSize : profile.farmSize}
                      onChange={(e) => setEditedProfile({ ...editedProfile, farmSize: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t("profile.cropTypes")}</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.primaryCrops.map((crop, index) => (
                        <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-800">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Statistics */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-900">{stats.totalQueries}</p>
                      <p className="text-sm text-emerald-700">{t("profile.totalQueries")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Download className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-900">{stats.dataDownloaded}</p>
                      <p className="text-sm text-emerald-700">{t("profile.dataDownloaded")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-900">{stats.lastSync}</p>
                      <p className="text-sm text-emerald-700">{t("profile.lastSync")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <WifiOff className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-900">{stats.offlineDataSize}</p>
                      <p className="text-sm text-emerald-700">{t("profile.offlineData")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-emerald-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                <CardTitle className="text-emerald-900">Feature Usage Breakdown</CardTitle>
                <CardDescription>How you've been using the Smart Crop Advisory system</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Weather Checks</span>
                    <span className="text-sm text-gray-600">{stats.weatherChecks}</span>
                  </div>
                  <Progress value={(stats.weatherChecks / stats.totalQueries) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Advisory Requests</span>
                    <span className="text-sm text-gray-600">{stats.advisoryRequests}</span>
                  </div>
                  <Progress value={(stats.advisoryRequests / stats.totalQueries) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Market Queries</span>
                    <span className="text-sm text-gray-600">{stats.marketQueries}</span>
                  </div>
                  <Progress value={(stats.marketQueries / stats.totalQueries) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Pest Detections</span>
                    <span className="text-sm text-gray-600">{stats.pestDetections}</span>
                  </div>
                  <Progress value={(stats.pestDetections / stats.totalQueries) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data">
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                <CardTitle className="text-emerald-900">{t("profile.dataManagement")}</CardTitle>
                <CardDescription>Export, import, and manage your farming data</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-emerald-200 rounded-lg">
                    <h4 className="font-medium text-emerald-900 mb-2">Export Data</h4>
                    <p className="text-sm text-gray-600 mb-4">Download all your farming data as a JSON file</p>
                    <Button onClick={downloadData} className="w-full bg-emerald-600 hover:bg-emerald-700">
                      <Download className="h-4 w-4 mr-2" />
                      Download Data
                    </Button>
                  </div>

                  <div className="p-4 border border-emerald-200 rounded-lg">
                    <h4 className="font-medium text-emerald-900 mb-2">Sync Status</h4>
                    <p className="text-sm text-gray-600 mb-4">Last synchronized: {stats.lastSync}</p>
                    <Button
                      variant="outline"
                      className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Force Sync
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
                    <p className="text-sm text-red-700 mb-4">Permanently delete your account and all associated data</p>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t("profile.logout")}
          </Button>
        </div>
      </div>
    </div>
  )
}
