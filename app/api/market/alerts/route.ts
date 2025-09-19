import { type NextRequest, NextResponse } from "next/server"

// Real-time market alerts system
interface MarketAlert {
  id: string
  crop: string
  type: 'price_alert' | 'volume_alert' | 'trend_alert' | 'market_news'
  condition: 'above' | 'below' | 'equals'
  targetValue: number
  currentValue: number
  message: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  isActive: boolean
  createdAt: string
  triggeredAt?: string
}

// Mock alerts storage (in real app, use database)
let alerts: MarketAlert[] = [
  {
    id: 'alert_1',
    crop: 'wheat',
    type: 'price_alert',
    condition: 'above',
    targetValue: 2200,
    currentValue: 2150,
    message: 'Wheat price alert: Price above ₹2200 per quintal',
    priority: 'high',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'alert_2',
    crop: 'cotton',
    type: 'trend_alert',
    condition: 'above',
    targetValue: 10,
    currentValue: 12.4,
    message: 'Cotton trend alert: Price increase above 10%',
    priority: 'medium',
    isActive: true,
    createdAt: new Date().toISOString()
  }
]

// Price thresholds for automatic alerts
const PRICE_THRESHOLDS = {
  wheat: { high: 2200, low: 2000 },
  rice: { high: 3500, low: 3000 },
  cotton: { high: 7000, low: 6000 },
  sugarcane: { high: 400, low: 350 }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const crop = searchParams.get("crop")
  const type = searchParams.get("type")
  const priority = searchParams.get("priority")
  const active = searchParams.get("active")

  try {
    let filteredAlerts = alerts

    // Apply filters
    if (crop) {
      filteredAlerts = filteredAlerts.filter(alert => alert.crop === crop)
    }
    if (type) {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === type)
    }
    if (priority) {
      filteredAlerts = filteredAlerts.filter(alert => alert.priority === priority)
    }
    if (active === 'true') {
      filteredAlerts = filteredAlerts.filter(alert => alert.isActive)
    }

    return NextResponse.json({
      alerts: filteredAlerts,
      total: filteredAlerts.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Alerts API error:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, alertData, crop, priceData } = body

    switch (action) {
      case 'create_alert':
        if (!alertData) {
          return NextResponse.json({ error: 'Alert data is required' }, { status: 400 })
        }

        const newAlert: MarketAlert = {
          id: `alert_${Date.now()}`,
          crop: alertData.crop,
          type: alertData.type,
          condition: alertData.condition,
          targetValue: alertData.targetValue,
          currentValue: alertData.currentValue || 0,
          message: alertData.message,
          priority: alertData.priority || 'medium',
          isActive: true,
          createdAt: new Date().toISOString()
        }

        alerts.push(newAlert)
        return NextResponse.json({
          message: 'Alert created successfully',
          alert: newAlert
        })

      case 'update_alert':
        const alertId = alertData.id
        const alertIndex = alerts.findIndex(alert => alert.id === alertId)
        
        if (alertIndex === -1) {
          return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
        }

        alerts[alertIndex] = { ...alerts[alertIndex], ...alertData }
        return NextResponse.json({
          message: 'Alert updated successfully',
          alert: alerts[alertIndex]
        })

      case 'delete_alert':
        const deleteAlertId = alertData.id
        const deleteIndex = alerts.findIndex(alert => alert.id === deleteAlertId)
        
        if (deleteIndex === -1) {
          return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
        }

        alerts.splice(deleteIndex, 1)
        return NextResponse.json({
          message: 'Alert deleted successfully'
        })

      case 'check_price_alerts':
        if (!crop || !priceData) {
          return NextResponse.json({ error: 'Crop and price data are required' }, { status: 400 })
        }

        const triggeredAlerts = []
        const cropAlerts = alerts.filter(alert => 
          alert.crop === crop && 
          alert.isActive && 
          alert.type === 'price_alert'
        )

        for (const alert of cropAlerts) {
          let shouldTrigger = false
          
          switch (alert.condition) {
            case 'above':
              shouldTrigger = priceData.currentPrice > alert.targetValue
              break
            case 'below':
              shouldTrigger = priceData.currentPrice < alert.targetValue
              break
            case 'equals':
              shouldTrigger = Math.abs(priceData.currentPrice - alert.targetValue) < 10
              break
          }

          if (shouldTrigger && !alert.triggeredAt) {
            alert.triggeredAt = new Date().toISOString()
            alert.currentValue = priceData.currentPrice
            triggeredAlerts.push(alert)
          }
        }

        return NextResponse.json({
          triggeredAlerts,
          count: triggeredAlerts.length,
          timestamp: new Date().toISOString()
        })

      case 'generate_auto_alerts':
        if (!crop || !priceData) {
          return NextResponse.json({ error: 'Crop and price data are required' }, { status: 400 })
        }

        const autoAlerts = []
        const thresholds = PRICE_THRESHOLDS[crop as keyof typeof PRICE_THRESHOLDS]
        
        if (thresholds) {
          const { currentPrice, change } = priceData
          
          // High price alert
          if (currentPrice > thresholds.high) {
            const highAlert: MarketAlert = {
              id: `auto_alert_high_${Date.now()}`,
              crop,
              type: 'price_alert',
              condition: 'above',
              targetValue: thresholds.high,
              currentValue: currentPrice,
              message: `${crop} price is above threshold (₹${thresholds.high})`,
              priority: 'high',
              isActive: true,
              createdAt: new Date().toISOString()
            }
            autoAlerts.push(highAlert)
            alerts.push(highAlert)
          }

          // Low price alert
          if (currentPrice < thresholds.low) {
            const lowAlert: MarketAlert = {
              id: `auto_alert_low_${Date.now()}`,
              crop,
              type: 'price_alert',
              condition: 'below',
              targetValue: thresholds.low,
              currentValue: currentPrice,
              message: `${crop} price is below threshold (₹${thresholds.low})`,
              priority: 'medium',
              isActive: true,
              createdAt: new Date().toISOString()
            }
            autoAlerts.push(lowAlert)
            alerts.push(lowAlert)
          }

          // Significant change alert
          if (Math.abs(change) > 10) {
            const changeAlert: MarketAlert = {
              id: `auto_alert_change_${Date.now()}`,
              crop,
              type: 'trend_alert',
              condition: change > 0 ? 'above' : 'below',
              targetValue: 10,
              currentValue: Math.abs(change),
              message: `${crop} price changed by ${change.toFixed(2)}%`,
              priority: 'medium',
              isActive: true,
              createdAt: new Date().toISOString()
            }
            autoAlerts.push(changeAlert)
            alerts.push(changeAlert)
          }
        }

        return NextResponse.json({
          autoAlerts,
          count: autoAlerts.length,
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error("Alerts API POST error:", error)
    return NextResponse.json({ error: "Failed to process alert request" }, { status: 500 })
  }
}
