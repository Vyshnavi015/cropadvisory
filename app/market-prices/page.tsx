"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  BarChart3,
  MapPin,
  Calendar,
  AlertCircle,
  Target,
  Truck,
  Users,
} from "lucide-react"

export default function MarketPricesPage() {
  const [selectedState, setSelectedState] = useState("punjab")
  const [selectedCrop, setSelectedCrop] = useState("wheat")

  const marketData = [
    {
      crop: "Wheat",
      currentPrice: 2150,
      previousPrice: 2080,
      change: 3.37,
      unit: "per quintal",
      market: "Ludhiana Mandi",
      lastUpdated: "2 hours ago",
      trend: "up",
      volume: "2,450 quintals",
      quality: "FAQ",
    },
    {
      crop: "Rice",
      currentPrice: 3200,
      previousPrice: 3350,
      change: -4.48,
      unit: "per quintal",
      market: "Amritsar Mandi",
      lastUpdated: "1 hour ago",
      trend: "down",
      volume: "1,850 quintals",
      quality: "Grade A",
    },
    {
      crop: "Cotton",
      currentPrice: 6800,
      previousPrice: 6750,
      change: 0.74,
      unit: "per quintal",
      market: "Bathinda Mandi",
      lastUpdated: "3 hours ago",
      trend: "up",
      volume: "980 quintals",
      quality: "Medium",
    },
    {
      crop: "Corn",
      currentPrice: 1850,
      previousPrice: 1920,
      change: -3.65,
      unit: "per quintal",
      market: "Patiala Mandi",
      lastUpdated: "4 hours ago",
      trend: "down",
      volume: "3,200 quintals",
      quality: "FAQ",
    },
    {
      crop: "Sugarcane",
      currentPrice: 380,
      previousPrice: 375,
      change: 1.33,
      unit: "per quintal",
      market: "Jalandhar Mandi",
      lastUpdated: "5 hours ago",
      trend: "up",
      volume: "5,600 quintals",
      quality: "Good",
    },
    {
      crop: "Soybean",
      currentPrice: 4200,
      previousPrice: 4150,
      change: 1.2,
      unit: "per quintal",
      market: "Mohali Mandi",
      lastUpdated: "1 hour ago",
      trend: "up",
      volume: "1,200 quintals",
      quality: "Premium",
    },
  ]

  const priceHistory = [
    { date: "Jan 1", wheat: 2000, rice: 3100, cotton: 6500, corn: 1800 },
    { date: "Jan 5", wheat: 2050, rice: 3200, cotton: 6600, corn: 1850 },
    { date: "Jan 10", wheat: 2080, rice: 3350, cotton: 6750, corn: 1920 },
    { date: "Jan 15", wheat: 2150, rice: 3200, cotton: 6800, corn: 1850 },
  ]

  const marketInsights = [
    {
      title: "Wheat Prices Rising",
      description: "Wheat prices have increased by 7.5% this month due to strong export demand",
      impact: "Positive",
      recommendation: "Good time to sell wheat stocks",
    },
    {
      title: "Rice Market Volatility",
      description: "Rice prices showing fluctuation due to monsoon concerns in key growing regions",
      impact: "Neutral",
      recommendation: "Monitor weather updates closely",
    },
    {
      title: "Cotton Demand Strong",
      description: "Cotton prices stable with steady industrial demand from textile sector",
      impact: "Positive",
      recommendation: "Consider increasing cotton acreage",
    },
  ]

  const topMarkets = [
    { name: "Ludhiana Mandi", state: "Punjab", volume: "15,200 quintals", crops: 8 },
    { name: "Amritsar Mandi", state: "Punjab", volume: "12,800 quintals", crops: 6 },
    { name: "Bathinda Mandi", state: "Punjab", volume: "11,500 quintals", crops: 7 },
    { name: "Patiala Mandi", state: "Punjab", volume: "10,200 quintals", crops: 5 },
  ]

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up" || change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    } else {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    }
  }

  const getTrendColor = (change: number) => {
    return change > 0 ? "text-green-600" : "text-red-600"
  }

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "positive":
        return "bg-green-500"
      case "negative":
        return "bg-red-500"
      case "neutral":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-green-600" />
            <h1 className="text-xl font-bold text-green-800">Market Prices</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-green-900 mb-2">Live Market Prices</h2>
            <p className="text-green-700">
              Real-time crop prices and market trends to help you make informed decisions
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-8">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-48 border-green-200 focus:border-green-400">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="punjab">Punjab</SelectItem>
                <SelectItem value="haryana">Haryana</SelectItem>
                <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="w-48 border-green-200 focus:border-green-400">
                <SelectValue placeholder="Select Crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="cotton">Cotton</SelectItem>
                <SelectItem value="corn">Corn</SelectItem>
                <SelectItem value="sugarcane">Sugarcane</SelectItem>
                <SelectItem value="soybean">Soybean</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="prices" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/70 border border-green-200">
              <TabsTrigger value="prices" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Current Prices
              </TabsTrigger>
              <TabsTrigger value="trends" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Price Trends
              </TabsTrigger>
              <TabsTrigger value="insights" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Market Insights
              </TabsTrigger>
              <TabsTrigger value="markets" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Top Markets
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prices" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketData.map((item, index) => (
                  <Card key={index} className="bg-white/70 backdrop-blur-sm border-green-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-green-800">{item.crop}</CardTitle>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(item.trend, item.change)}
                          <span className={`text-sm font-semibold ${getTrendColor(item.change)}`}>
                            {item.change > 0 ? "+" : ""}
                            {item.change.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <CardDescription className="text-green-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.market}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-green-900">₹{item.currentPrice.toLocaleString()}</p>
                          <p className="text-xs text-green-600">{item.unit}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-600">Previous</p>
                          <p className="text-sm font-semibold text-green-800">₹{item.previousPrice.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-green-600">Volume</p>
                          <p className="font-semibold text-green-800">{item.volume}</p>
                        </div>
                        <div>
                          <p className="text-green-600">Quality</p>
                          <p className="font-semibold text-green-800">{item.quality}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-green-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Updated {item.lastUpdated}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Price Trends (Last 15 Days)</CardTitle>
                  <CardDescription className="text-green-600">Track price movements over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                          }}
                        />
                        <Line type="monotone" dataKey="wheat" stroke="#059669" strokeWidth={2} name="Wheat" />
                        <Line type="monotone" dataKey="rice" stroke="#3b82f6" strokeWidth={2} name="Rice" />
                        <Line type="monotone" dataKey="cotton" stroke="#f59e0b" strokeWidth={2} name="Cotton" />
                        <Line type="monotone" dataKey="corn" stroke="#ef4444" strokeWidth={2} name="Corn" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Volume Comparison</CardTitle>
                  <CardDescription className="text-green-600">Trading volumes across different crops</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={marketData.map((item) => ({
                          crop: item.crop,
                          volume: Number.parseInt(item.volume.replace(/[^\d]/g, "")),
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="crop" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="volume" fill="#059669" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="space-y-4">
                {marketInsights.map((insight, index) => (
                  <Card key={index} className="bg-white/70 backdrop-blur-sm border-green-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-green-800 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" />
                          {insight.title}
                        </CardTitle>
                        <Badge className={getImpactColor(insight.impact)}>{insight.impact}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-green-700">{insight.description}</p>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-800">Recommendation:</span>
                        <span className="text-sm text-green-700">{insight.recommendation}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-white/70 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Market Analysis Summary</CardTitle>
                  <CardDescription className="text-green-600">Key takeaways for farmers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-800 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Opportunities
                      </h4>
                      <ul className="space-y-2 text-sm text-green-700">
                        <li>• Wheat prices showing strong upward trend</li>
                        <li>• Cotton demand remains stable with good margins</li>
                        <li>• Export opportunities increasing for quality produce</li>
                        <li>• Government procurement at MSP continues</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-800 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        Considerations
                      </h4>
                      <ul className="space-y-2 text-sm text-green-700">
                        <li>• Rice prices volatile due to weather concerns</li>
                        <li>• Transportation costs affecting margins</li>
                        <li>• Quality standards becoming more stringent</li>
                        <li>• Storage facilities crucial for better prices</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="markets" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {topMarkets.map((market, index) => (
                  <Card key={index} className="bg-white/70 backdrop-blur-sm border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-800 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {market.name}
                      </CardTitle>
                      <CardDescription className="text-green-600">{market.state}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-xs text-green-600">Daily Volume</p>
                            <p className="font-semibold text-green-900">{market.volume}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-500" />
                          <div>
                            <p className="text-xs text-green-600">Crops Traded</p>
                            <p className="font-semibold text-green-900">{market.crops} varieties</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                      >
                        View Market Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-white/70 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Market Selection Tips</CardTitle>
                  <CardDescription className="text-green-600">
                    Choose the right market for better prices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-800">Factors to Consider</h4>
                      <ul className="space-y-1 text-sm text-green-700">
                        <li>• Distance from your farm</li>
                        <li>• Transportation costs</li>
                        <li>• Market fees and charges</li>
                        <li>• Payment terms and reliability</li>
                        <li>• Quality standards and grading</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-800">Best Practices</h4>
                      <ul className="space-y-1 text-sm text-green-700">
                        <li>• Compare prices across multiple markets</li>
                        <li>• Check market timings and holidays</li>
                        <li>• Maintain quality during transportation</li>
                        <li>• Build relationships with commission agents</li>
                        <li>• Keep updated with market news</li>
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
