import { type NextRequest, NextResponse } from "next/server"

// Real-time market data simulation
class MarketDataSimulator {
  private baseData: any
  private priceVariations: { [key: string]: number } = {}
  private lastUpdate: { [key: string]: number } = {}

  constructor(initialData: any) {
    this.baseData = JSON.parse(JSON.stringify(initialData))
    // Initialize price variations for each crop
    Object.keys(this.baseData.crops).forEach(crop => {
      this.priceVariations[crop] = 0
      this.lastUpdate[crop] = Date.now()
    })
  }

  // Simulate realistic price fluctuations
  updatePrices() {
    const now = Date.now()
    
    Object.keys(this.baseData.crops).forEach(crop => {
      const timeDiff = now - this.lastUpdate[crop]
      if (timeDiff > 5000) { // Update every 5 seconds
        const cropData = this.baseData.crops[crop]
        const volatility = 0.02 // 2% volatility
        const randomChange = (Math.random() - 0.5) * volatility
        const trendMultiplier = cropData.trend === 'up' ? 1.1 : 0.9
        
        // Calculate new price with trend and random fluctuation
        const newPrice = Math.max(1, cropData.currentPrice * (1 + randomChange * trendMultiplier))
        const priceChange = ((newPrice - cropData.currentPrice) / cropData.currentPrice) * 100
        
        // Update price and related data
        cropData.currentPrice = Math.round(newPrice)
        cropData.change = Math.round(priceChange * 100) / 100
        cropData.trend = priceChange > 0 ? 'up' : 'down'
        
        // Update market prices
        cropData.markets.forEach((market: any) => {
          const marketVariation = (Math.random() - 0.5) * 0.01 // 1% market variation
          market.price = Math.round(newPrice * (1 + marketVariation))
        })
        
        // Add to price history
        cropData.priceHistory.push({
          date: new Date().toISOString().split('T')[0],
          price: Math.round(newPrice)
        })
        
        // Keep only last 30 days of history
        if (cropData.priceHistory.length > 30) {
          cropData.priceHistory = cropData.priceHistory.slice(-30)
        }
        
        this.lastUpdate[crop] = now
      }
    })
  }

  getLiveData() {
    this.updatePrices()
    return {
      ...this.baseData,
      timestamp: new Date().toISOString(),
      isLive: true
    }
  }

  getCropLiveData(crop: string) {
    this.updatePrices()
    if (this.baseData.crops[crop]) {
      return {
        crop: this.baseData.crops[crop],
        insights: this.baseData.insights.filter((insight: any) => insight.crop === crop),
        timestamp: new Date().toISOString(),
        isLive: true
      }
    }
    return null
  }
}

// Mock market data - In a real app, this would come from agricultural market APIs
const MARKET_DATA = {
  crops: {
    wheat: {
      name: "Wheat",
      currentPrice: 2150,
      unit: "per quintal",
      change: 8.5,
      trend: "up",
      markets: [
        { name: "Ludhiana Mandi", price: 2150, distance: "5 km" },
        { name: "Jalandhar Mandi", price: 2140, distance: "45 km" },
        { name: "Amritsar Mandi", price: 2160, distance: "85 km" },
      ],
      priceHistory: [
        { date: "2024-01-15", price: 2100 },
        { date: "2024-01-16", price: 2120 },
        { date: "2024-01-17", price: 2135 },
        { date: "2024-01-18", price: 2150 },
      ],
    },
    rice: {
      name: "Rice",
      currentPrice: 3200,
      unit: "per quintal",
      change: -2.3,
      trend: "down",
      markets: [
        { name: "Ludhiana Mandi", price: 3200, distance: "5 km" },
        { name: "Patiala Mandi", price: 3180, distance: "65 km" },
        { name: "Bathinda Mandi", price: 3220, distance: "120 km" },
      ],
      priceHistory: [
        { date: "2024-01-15", price: 3280 },
        { date: "2024-01-16", price: 3250 },
        { date: "2024-01-17", price: 3220 },
        { date: "2024-01-18", price: 3200 },
      ],
    },
    cotton: {
      name: "Cotton",
      currentPrice: 6800,
      unit: "per quintal",
      change: 12.4,
      trend: "up",
      markets: [
        { name: "Bathinda Mandi", price: 6800, distance: "120 km" },
        { name: "Sirsa Mandi", price: 6750, distance: "180 km" },
        { name: "Hisar Mandi", price: 6820, distance: "220 km" },
      ],
      priceHistory: [
        { date: "2024-01-15", price: 6050 },
        { date: "2024-01-16", price: 6200 },
        { date: "2024-01-17", price: 6500 },
        { date: "2024-01-18", price: 6800 },
      ],
    },
    sugarcane: {
      name: "Sugarcane",
      currentPrice: 380,
      unit: "per quintal",
      change: 5.2,
      trend: "up",
      markets: [
        { name: "Jalandhar Mandi", price: 380, distance: "45 km" },
        { name: "Ludhiana Mandi", price: 375, distance: "5 km" },
        { name: "Kapurthala Mandi", price: 385, distance: "35 km" },
      ],
      priceHistory: [
        { date: "2024-01-15", price: 361 },
        { date: "2024-01-16", price: 368 },
        { date: "2024-01-17", price: 375 },
        { date: "2024-01-18", price: 380 },
      ],
    },
  },
  insights: [
    {
      type: "price_alert",
      crop: "wheat",
      message: "Wheat prices have increased by 8.5% in the last week. Good time to sell if you have stock.",
      priority: "high",
    },
    {
      type: "market_trend",
      crop: "cotton",
      message: "Cotton demand is rising due to export orders. Prices expected to remain strong.",
      priority: "medium",
    },
    {
      type: "seasonal_advice",
      crop: "rice",
      message: "Rice prices typically drop during harvest season. Consider storage options.",
      priority: "low",
    },
  ],
}

// Initialize the market data simulator
const marketSimulator = new MarketDataSimulator(MARKET_DATA)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const crop = searchParams.get("crop")
  const state = searchParams.get("state") || "punjab"
  const realtime = searchParams.get("realtime") === "true"

  try {
    if (realtime) {
      // Return real-time data
      if (crop && MARKET_DATA.crops[crop as keyof typeof MARKET_DATA.crops]) {
        const liveCropData = marketSimulator.getCropLiveData(crop)
        if (liveCropData) {
          return NextResponse.json(liveCropData)
        }
      }
      
      // Return all real-time market data
      const liveData = marketSimulator.getLiveData()
      return NextResponse.json({
        ...liveData,
        state: state,
      })
    }

    // Return static data (original behavior)
    if (crop && MARKET_DATA.crops[crop as keyof typeof MARKET_DATA.crops]) {
      // Return specific crop data
      const cropData = MARKET_DATA.crops[crop as keyof typeof MARKET_DATA.crops]
      return NextResponse.json({
        crop: cropData,
        insights: MARKET_DATA.insights.filter((insight) => insight.crop === crop),
        timestamp: new Date().toISOString(),
        isLive: false,
      })
    }

    // Return all market data
    return NextResponse.json({
      crops: MARKET_DATA.crops,
      insights: MARKET_DATA.insights,
      state: state,
      timestamp: new Date().toISOString(),
      isLive: false,
    })
  } catch (error) {
    console.error("Market API error:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}

// New endpoint for real-time price updates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, crop, priceAlert } = body

    switch (action) {
      case 'subscribe':
        // In a real implementation, this would set up WebSocket subscriptions
        return NextResponse.json({ 
          message: 'Subscribed to real-time updates',
          subscriptionId: `sub_${Date.now()}`,
          timestamp: new Date().toISOString()
        })

      case 'unsubscribe':
        return NextResponse.json({ 
          message: 'Unsubscribed from real-time updates',
          timestamp: new Date().toISOString()
        })

      case 'set_price_alert':
        if (!crop || !priceAlert) {
          return NextResponse.json({ error: 'Crop and price alert are required' }, { status: 400 })
        }
        
        // In a real implementation, this would store the alert in a database
        return NextResponse.json({
          message: 'Price alert set successfully',
          alert: {
            crop,
            targetPrice: priceAlert.targetPrice,
            condition: priceAlert.condition, // 'above' or 'below'
            isActive: true,
            createdAt: new Date().toISOString()
          }
        })

      case 'get_live_prices':
        const liveData = marketSimulator.getLiveData()
        return NextResponse.json({
          prices: Object.keys(liveData.crops).map(cropKey => ({
            crop: cropKey,
            name: liveData.crops[cropKey].name,
            currentPrice: liveData.crops[cropKey].currentPrice,
            change: liveData.crops[cropKey].change,
            trend: liveData.crops[cropKey].trend,
            timestamp: new Date().toISOString()
          }))
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error("Market API POST error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
