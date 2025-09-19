"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Leaf,
  ArrowLeft,
  Droplets,
  Calendar,
  Beaker,
  Sprout,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CropAdvisoryPage() {
  const [selectedCrop, setSelectedCrop] = useState("")
  const [soilType, setSoilType] = useState("")
  const [farmSize, setFarmSize] = useState("")
  const [currentStage, setCurrentStage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [advisoryResult, setAdvisoryResult] = useState<any>(null)
  const { toast } = useToast()

  const cropRecommendations = [
    {
      crop: "Wheat",
      season: "Rabi",
      suitability: 95,
      expectedYield: "4.5 tons/acre",
      investment: "₹25,000/acre",
      profitability: "High",
      reasons: ["Optimal soil conditions", "Favorable weather", "Good market demand"],
    },
    {
      crop: "Rice",
      season: "Kharif",
      suitability: 88,
      expectedYield: "3.8 tons/acre",
      investment: "₹30,000/acre",
      profitability: "Medium",
      reasons: ["Adequate water supply", "Suitable climate", "Stable prices"],
    },
    {
      crop: "Corn",
      season: "Kharif",
      suitability: 82,
      expectedYield: "5.2 tons/acre",
      investment: "₹22,000/acre",
      profitability: "High",
      reasons: ["Good soil fertility", "Market demand", "Drought resistant"],
    },
  ]

  const fertilizerRecommendations = [
    {
      type: "NPK 10:26:26",
      quantity: "50 kg/acre",
      timing: "At sowing",
      cost: "₹1,200",
      purpose: "Balanced nutrition for early growth",
    },
    {
      type: "Urea",
      quantity: "25 kg/acre",
      timing: "30 days after sowing",
      cost: "₹600",
      purpose: "Nitrogen boost for vegetative growth",
    },
    {
      type: "DAP",
      quantity: "30 kg/acre",
      timing: "Before flowering",
      cost: "₹900",
      purpose: "Phosphorus for root development",
    },
  ]

  const handleGetAdvice = async () => {
    if (!selectedCrop || !soilType || !farmSize) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setAdvisoryResult({
        crop: selectedCrop,
        recommendations: cropRecommendations.filter((rec) => rec.crop === selectedCrop)[0] || cropRecommendations[0],
        fertilizers: fertilizerRecommendations,
        nextSteps: [
          "Prepare soil with proper tillage",
          "Apply recommended fertilizers",
          "Ensure proper irrigation schedule",
          "Monitor for pest and disease",
        ],
      })
      setIsLoading(false)
      toast({
        title: "Advisory Generated!",
        description: "Your personalized crop advisory is ready",
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-emerald-600" />
            <h1 className="text-xl font-bold text-emerald-800">Crop Advisory System</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-emerald-900 mb-2">Smart Crop Advisory</h2>
            <p className="text-emerald-700">Get personalized recommendations for your farming needs</p>
          </div>

          <Tabs defaultValue="advisory" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/70 border border-emerald-200">
              <TabsTrigger
                value="advisory"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Get Advisory
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Crop Recommendations
              </TabsTrigger>
              <TabsTrigger
                value="fertilizers"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Fertilizer Guide
              </TabsTrigger>
            </TabsList>

            <TabsContent value="advisory" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
                  <CardHeader>
                    <CardTitle className="text-emerald-800 flex items-center gap-2">
                      <Sprout className="h-5 w-5" />
                      Farm Information
                    </CardTitle>
                    <CardDescription className="text-emerald-600">
                      Provide details about your farm for personalized advice
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-emerald-700">Crop Type</Label>
                      <Select onValueChange={setSelectedCrop}>
                        <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                          <SelectValue placeholder="Select crop type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Wheat">Wheat</SelectItem>
                          <SelectItem value="Rice">Rice</SelectItem>
                          <SelectItem value="Corn">Corn</SelectItem>
                          <SelectItem value="Cotton">Cotton</SelectItem>
                          <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                          <SelectItem value="Soybean">Soybean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-emerald-700">Soil Type</Label>
                      <Select onValueChange={setSoilType}>
                        <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clay">Clay</SelectItem>
                          <SelectItem value="loamy">Loamy</SelectItem>
                          <SelectItem value="sandy">Sandy</SelectItem>
                          <SelectItem value="silt">Silt</SelectItem>
                          <SelectItem value="black">Black Cotton</SelectItem>
                          <SelectItem value="red">Red Soil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-emerald-700">Farm Size (acres)</Label>
                      <Input
                        type="number"
                        placeholder="Enter farm size"
                        value={farmSize}
                        onChange={(e) => setFarmSize(e.target.value)}
                        className="border-emerald-200 focus:border-emerald-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-emerald-700">Current Growth Stage</Label>
                      <Select onValueChange={setCurrentStage}>
                        <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                          <SelectValue placeholder="Select current stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning/Pre-sowing</SelectItem>
                          <SelectItem value="sowing">Sowing</SelectItem>
                          <SelectItem value="germination">Germination</SelectItem>
                          <SelectItem value="vegetative">Vegetative</SelectItem>
                          <SelectItem value="flowering">Flowering</SelectItem>
                          <SelectItem value="maturity">Maturity</SelectItem>
                          <SelectItem value="harvest">Harvest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-emerald-700">Additional Notes</Label>
                      <Textarea
                        placeholder="Any specific concerns or questions..."
                        className="border-emerald-200 focus:border-emerald-400"
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={handleGetAdvice}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Generating Advisory...
                        </>
                      ) : (
                        <>
                          <Leaf className="h-4 w-4 mr-2" />
                          Get Personalized Advisory
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Advisory Results */}
                {advisoryResult && (
                  <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
                    <CardHeader>
                      <CardTitle className="text-emerald-800 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Your Personalized Advisory
                      </CardTitle>
                      <CardDescription className="text-emerald-600">
                        Recommendations for {advisoryResult.crop}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-emerald-600">Expected Yield</p>
                          <p className="font-semibold text-emerald-900">
                            {advisoryResult.recommendations.expectedYield}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-emerald-600">Investment Required</p>
                          <p className="font-semibold text-emerald-900">{advisoryResult.recommendations.investment}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-emerald-600">Profitability</p>
                        <Badge
                          className={
                            advisoryResult.recommendations.profitability === "High"
                              ? "bg-green-500"
                              : advisoryResult.recommendations.profitability === "Medium"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }
                        >
                          {advisoryResult.recommendations.profitability}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-emerald-600">Key Advantages</p>
                        <ul className="space-y-1">
                          {advisoryResult.recommendations.reasons.map((reason: string, index: number) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-emerald-700">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-emerald-600">Next Steps</p>
                        <ul className="space-y-1">
                          {advisoryResult.nextSteps.map((step: string, index: number) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-emerald-700">
                              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-600">
                                {index + 1}
                              </div>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cropRecommendations.map((crop, index) => (
                  <Card key={index} className="bg-white/70 backdrop-blur-sm border-emerald-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-emerald-800">{crop.crop}</CardTitle>
                        <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                          {crop.season}
                        </Badge>
                      </div>
                      <CardDescription className="text-emerald-600">Suitability: {crop.suitability}%</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-emerald-600">Expected Yield</span>
                          <span className="text-sm font-semibold text-emerald-900">{crop.expectedYield}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-emerald-600">Investment</span>
                          <span className="text-sm font-semibold text-emerald-900">{crop.investment}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-emerald-600">Profitability</span>
                          <Badge
                            className={
                              crop.profitability === "High"
                                ? "bg-green-500"
                                : crop.profitability === "Medium"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }
                          >
                            {crop.profitability}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-emerald-600">Key Benefits:</p>
                        <ul className="space-y-1">
                          {crop.reasons.slice(0, 2).map((reason, idx) => (
                            <li key={idx} className="text-xs text-emerald-700 flex items-center gap-1">
                              <CheckCircle className="h-2 w-2 text-green-500" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="fertilizers" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fertilizerRecommendations.map((fertilizer, index) => (
                  <Card key={index} className="bg-white/70 backdrop-blur-sm border-emerald-200">
                    <CardHeader>
                      <CardTitle className="text-emerald-800 flex items-center gap-2">
                        <Beaker className="h-5 w-5" />
                        {fertilizer.type}
                      </CardTitle>
                      <CardDescription className="text-emerald-600">{fertilizer.purpose}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-emerald-600">Quantity:</span>
                          <span className="text-sm font-semibold text-emerald-900">{fertilizer.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-orange-500" />
                          <span className="text-sm text-emerald-600">Timing:</span>
                          <span className="text-sm font-semibold text-emerald-900">{fertilizer.timing}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-emerald-600">Cost:</span>
                          <span className="text-sm font-semibold text-emerald-900">{fertilizer.cost}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-800 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Application Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-emerald-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      Always conduct soil testing before applying fertilizers
                    </li>
                    <li className="flex items-start gap-2 text-sm text-emerald-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      Apply fertilizers during cool hours (early morning or evening)
                    </li>
                    <li className="flex items-start gap-2 text-sm text-emerald-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      Ensure adequate moisture in soil before application
                    </li>
                    <li className="flex items-start gap-2 text-sm text-emerald-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      Follow recommended dosage to avoid over-fertilization
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
