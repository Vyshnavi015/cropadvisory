"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Cloud, Bug, TrendingUp, Users, Shield, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { motion } from "framer-motion"

export default function HomePage() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Leaf,
      titleKey: "home.features.advisory",
      descKey: "Crop Advisory Description",
      color: "emerald",
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      icon: Cloud,
      titleKey: "home.features.weather",
      descKey: "Weather Forecasting Description",
      color: "blue",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Bug,
      titleKey: "home.features.pest",
      descKey: "Pest Detection Description",
      color: "orange",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      icon: TrendingUp,
      titleKey: "home.features.market",
      descKey: "Market Prices Description",
      color: "green",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Users,
      titleKey: "home.features.multilingual",
      descKey: "Multilingual Support Description",
      color: "purple",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Shield,
      titleKey: "home.features.offline",
      descKey: "Offline Access Description",
      color: "red",
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ]

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

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Link href="/login">
              <Button
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent transition-all duration-200 hover:scale-105"
              >
                {t("auth.login")}
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 hover:scale-105 shadow-lg border border-emerald-600">
                {t("auth.register")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-6xl font-bold bg-gradient-to-r from-emerald-800 via-green-700 to-yellow-600 bg-clip-text text-transparent mb-6 text-balance">
              {t("home.title")}
            </h2>
            <p className="text-xl text-emerald-700 mb-8 text-pretty leading-relaxed">{t("home.subtitle")}</p>
          </motion.div>

          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link href="/register">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-emerald-600"
              >
                {t("home.getStarted")}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                {t("home.learnMore")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <motion.h3
          className="text-4xl font-bold text-center bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Comprehensive Farming Solutions
        </motion.h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-emerald-300 group cursor-pointer h-full">
                <CardHeader className="text-center">
                  <motion.div
                    className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                  </motion.div>
                  <CardTitle className="text-emerald-800 text-xl mb-2">{t(feature.titleKey)}</CardTitle>
                  <CardDescription className="text-emerald-600 leading-relaxed">
                    {feature.titleKey === "home.features.advisory" &&
                      "Get personalized recommendations for crop selection, fertilizers, and farming practices"}
                    {feature.titleKey === "home.features.weather" &&
                      "Real-time weather updates and predictive insights for better planning"}
                    {feature.titleKey === "home.features.pest" &&
                      "AI-powered pest and disease identification through image analysis"}
                    {feature.titleKey === "home.features.market" &&
                      "Live market price tracking and trend analysis for better selling decisions"}
                    {feature.titleKey === "home.features.multilingual" &&
                      "Available in 10 Indian languages with voice support"}
                    {feature.titleKey === "home.features.offline" &&
                      "Access key features and data even without internet connectivity"}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Farming?</h3>
            <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Join thousands of farmers already using {t("app.title")} to increase their yield and income.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white"
              >
                Start Your Journey Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-emerald-800 to-green-800 text-emerald-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Leaf className="h-6 w-6" />
            <span className="text-xl font-bold">{t("app.title")}</span>
          </motion.div>
          <p className="text-emerald-300">Empowering farmers with smart agricultural solutions</p>
        </div>
      </footer>
    </div>
  )
}
