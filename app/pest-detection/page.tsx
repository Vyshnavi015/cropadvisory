"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Camera,
  ArrowLeft,
  Upload,
  Bug,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Shield,
  Leaf,
  Eye,
  FileImage,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PestDetectionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [detectionHistory, setDetectionHistory] = useState([
    {
      id: 1,
      date: "2024-01-10",
      crop: "Wheat",
      pest: "Aphids",
      confidence: 92,
      severity: "Medium",
      status: "Treated",
    },
    {
      id: 2,
      date: "2024-01-08",
      crop: "Rice",
      pest: "Brown Planthopper",
      confidence: 88,
      severity: "High",
      status: "Under Treatment",
    },
    {
      id: 3,
      date: "2024-01-05",
      crop: "Corn",
      pest: "Corn Borer",
      confidence: 95,
      severity: "Low",
      status: "Monitored",
    },
  ])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const commonPests = [
    {
      name: "Aphids",
      crops: ["Wheat", "Rice", "Cotton"],
      symptoms: ["Yellowing leaves", "Sticky honeydew", "Curled leaves"],
      treatment: "Neem oil spray or systemic insecticides",
      severity: "Medium",
    },
    {
      name: "Brown Planthopper",
      crops: ["Rice"],
      symptoms: ["Brown patches", "Stunted growth", "Hopper burn"],
      treatment: "Resistant varieties and targeted insecticides",
      severity: "High",
    },
    {
      name: "Bollworm",
      crops: ["Cotton", "Corn"],
      symptoms: ["Holes in bolls", "Damaged fruits", "Larvae presence"],
      treatment: "Bt cotton varieties and pheromone traps",
      severity: "High",
    },
    {
      name: "Stem Borer",
      crops: ["Rice", "Corn"],
      symptoms: ["Dead hearts", "White ears", "Stem tunneling"],
      treatment: "Early planting and biological control",
      severity: "Medium",
    },
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setAnalysisResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      const mockResult = {
        pest: "Aphids",
        confidence: 89,
        severity: "Medium",
        crop: "Wheat",
        description:
          "Green peach aphids detected on wheat leaves. These small, soft-bodied insects feed on plant sap and can cause yellowing and curling of leaves.",
        symptoms: ["Yellowing leaves", "Sticky honeydew on leaves", "Curled leaf edges", "Stunted growth"],
        treatment: {
          immediate: ["Remove affected leaves", "Spray with water to dislodge aphids"],
          chemical: ["Apply neem oil spray", "Use systemic insecticides if severe"],
          biological: ["Introduce ladybugs", "Encourage beneficial insects"],
          preventive: ["Regular monitoring", "Avoid over-fertilization", "Maintain field hygiene"],
        },
        timeline: "Apply treatment within 2-3 days for best results",
        cost: "₹500-800 per acre for treatment",
      }
      setAnalysisResult(mockResult)
      setIsAnalyzing(false)
      toast({
        title: "Analysis Complete!",
        description: `${mockResult.pest} detected with ${mockResult.confidence}% confidence`,
      })
    }, 3000)
  }

  const handleCameraCapture = () => {
    // In a real app, this would open camera
    toast({
      title: "Camera Feature",
      description: "Camera capture will be available in the mobile app",
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "treated":
        return "bg-green-500"
      case "under treatment":
        return "bg-yellow-500"
      case "monitored":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-orange-700 hover:text-orange-800 hover:bg-orange-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Bug className="h-6 w-6 text-orange-600" />
            <h1 className="text-xl font-bold text-orange-800">Pest Detection</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-orange-900 mb-2">AI-Powered Pest Detection</h2>
            <p className="text-orange-700">
              Upload crop images for instant pest identification and treatment recommendations
            </p>
          </div>

          <Tabs defaultValue="detection" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/70 border border-orange-200">
              <TabsTrigger
                value="detection"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
              >
                Pest Detection
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                Detection History
              </TabsTrigger>
              <TabsTrigger
                value="database"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
              >
                Pest Database
              </TabsTrigger>
            </TabsList>

            <TabsContent value="detection" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Image Upload Section */}
                <Card className="bg-white/70 backdrop-blur-sm border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-800 flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Upload Crop Image
                    </CardTitle>
                    <CardDescription className="text-orange-600">
                      Take a clear photo of affected crop parts for accurate detection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!selectedImage ? (
                      <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
                        <FileImage className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                        <p className="text-orange-600 mb-4">Upload an image or take a photo</p>
                        <div className="flex gap-3 justify-center">
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                          <Button
                            onClick={handleCameraCapture}
                            variant="outline"
                            className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Take Photo
                          </Button>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative">
                          <img
                            src={selectedImage || "/placeholder.svg"}
                            alt="Uploaded crop"
                            className="w-full h-64 object-cover rounded-lg border border-orange-200"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            {isAnalyzing ? (
                              <>
                                <Clock className="h-4 w-4 mr-2 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Analyze Image
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedImage(null)
                              setAnalysisResult(null)
                            }}
                            variant="outline"
                            className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    )}

                    {isAnalyzing && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-orange-500" />
                          <span className="text-sm text-orange-700">AI Analysis in Progress...</span>
                        </div>
                        <Progress value={66} className="h-2" />
                        <p className="text-xs text-orange-600">Processing image and identifying potential pests</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Analysis Results */}
                {analysisResult && (
                  <Card className="bg-white/70 backdrop-blur-sm border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-orange-800 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Detection Results
                      </CardTitle>
                      <CardDescription className="text-orange-600">
                        AI analysis completed with {analysisResult.confidence}% confidence
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-orange-600">Detected Pest</p>
                          <p className="font-semibold text-orange-900">{analysisResult.pest}</p>
                        </div>
                        <div>
                          <p className="text-sm text-orange-600">Affected Crop</p>
                          <p className="font-semibold text-orange-900">{analysisResult.crop}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-orange-600">Confidence Level</p>
                          <div className="flex items-center gap-2">
                            <Progress value={analysisResult.confidence} className="w-20 h-2" />
                            <span className="text-sm font-semibold text-orange-900">{analysisResult.confidence}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-orange-600">Severity</p>
                          <Badge className={getSeverityColor(analysisResult.severity)}>{analysisResult.severity}</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-orange-600">Description</p>
                        <p className="text-sm text-orange-700">{analysisResult.description}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-orange-600">Observed Symptoms</p>
                        <ul className="space-y-1">
                          {analysisResult.symptoms.map((symptom: string, index: number) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-orange-700">
                              <AlertTriangle className="h-3 w-3 text-yellow-500" />
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Treatment Recommendations */}
              {analysisResult && (
                <Card className="bg-white/70 backdrop-blur-sm border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-800 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Treatment Recommendations
                    </CardTitle>
                    <CardDescription className="text-orange-600">
                      Comprehensive treatment plan for {analysisResult.pest}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-orange-800">Immediate Actions</h4>
                        <ul className="space-y-2">
                          {analysisResult.treatment.immediate.map((action: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-orange-700">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-orange-800">Chemical Treatment</h4>
                        <ul className="space-y-2">
                          {analysisResult.treatment.chemical.map((treatment: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-orange-700">
                              <Zap className="h-4 w-4 text-blue-500 mt-0.5" />
                              {treatment}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-orange-800">Biological Control</h4>
                        <ul className="space-y-2">
                          {analysisResult.treatment.biological.map((method: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-orange-700">
                              <Leaf className="h-4 w-4 text-green-500 mt-0.5" />
                              {method}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-orange-800">Prevention</h4>
                        <ul className="space-y-2">
                          {analysisResult.treatment.preventive.map((prevention: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-orange-700">
                              <Shield className="h-4 w-4 text-purple-500 mt-0.5" />
                              {prevention}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertTitle className="text-orange-800">Important Notes</AlertTitle>
                      <AlertDescription className="text-orange-700">
                        <div className="space-y-1">
                          <p>• {analysisResult.timeline}</p>
                          <p>• Estimated treatment cost: {analysisResult.cost}</p>
                          <p>• Always follow label instructions when using pesticides</p>
                          <p>• Consider weather conditions before application</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Detection History</CardTitle>
                  <CardDescription className="text-orange-600">Your recent pest detection records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {detectionHistory.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-white/50"
                      >
                        <div className="flex items-center gap-4">
                          <Bug className="h-8 w-8 text-orange-500" />
                          <div>
                            <h4 className="font-semibold text-orange-800">{record.pest}</h4>
                            <p className="text-sm text-orange-600">
                              {record.crop} • {record.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm text-orange-600">Confidence</p>
                            <p className="font-semibold text-orange-900">{record.confidence}%</p>
                          </div>
                          <Badge className={getSeverityColor(record.severity)}>{record.severity}</Badge>
                          <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {commonPests.map((pest, index) => (
                  <Card key={index} className="bg-white/70 backdrop-blur-sm border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-orange-800 flex items-center gap-2">
                        <Bug className="h-5 w-5" />
                        {pest.name}
                      </CardTitle>
                      <CardDescription className="text-orange-600">Affects: {pest.crops.join(", ")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Badge className={getSeverityColor(pest.severity)}>{pest.severity} Risk</Badge>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-orange-800">Common Symptoms</h4>
                        <ul className="space-y-1">
                          {pest.symptoms.map((symptom, idx) => (
                            <li key={idx} className="text-xs text-orange-700 flex items-center gap-1">
                              <AlertTriangle className="h-2 w-2 text-yellow-500" />
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-orange-800">Treatment</h4>
                        <p className="text-xs text-orange-700">{pest.treatment}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
