import { type NextRequest, NextResponse } from "next/server"

// Live trading data simulation
interface TradingOrder {
  id: string
  crop: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  status: 'pending' | 'filled' | 'cancelled'
  timestamp: string
  trader: string
}

interface MarketDepth {
  crop: string
  buyOrders: Array<{ price: number; quantity: number; count: number }>
  sellOrders: Array<{ price: number; quantity: number; count: number }>
  lastTrade: {
    price: number
    quantity: number
    timestamp: string
  }
  volume24h: number
  high24h: number
  low24h: number
}

// Mock trading data
let tradingOrders: TradingOrder[] = []
let marketDepth: { [crop: string]: MarketDepth } = {}

// Initialize market depth for each crop
const initializeMarketDepth = (crop: string) => {
  if (!marketDepth[crop]) {
    marketDepth[crop] = {
      crop,
      buyOrders: [
        { price: 2100, quantity: 100, count: 5 },
        { price: 2095, quantity: 150, count: 8 },
        { price: 2090, quantity: 200, count: 12 }
      ],
      sellOrders: [
        { price: 2160, quantity: 120, count: 6 },
        { price: 2165, quantity: 180, count: 9 },
        { price: 2170, quantity: 250, count: 15 }
      ],
      lastTrade: {
        price: 2150,
        quantity: 50,
        timestamp: new Date().toISOString()
      },
      volume24h: 0,
      high24h: 0,
      low24h: 0
    }
  }
}

// Simulate order matching
const processOrder = (order: TradingOrder) => {
  const depth = marketDepth[order.crop]
  if (!depth) return order

  if (order.type === 'buy') {
    // Find matching sell orders
    const matchingSell = depth.sellOrders.find(sell => sell.price <= order.price)
    if (matchingSell && matchingSell.quantity >= order.quantity) {
      order.status = 'filled'
      order.price = matchingSell.price
      
      // Update market depth
      matchingSell.quantity -= order.quantity
      if (matchingSell.quantity === 0) {
        depth.sellOrders = depth.sellOrders.filter(s => s !== matchingSell)
      }
      
      // Update last trade
      depth.lastTrade = {
        price: order.price,
        quantity: order.quantity,
        timestamp: new Date().toISOString()
      }
      
      // Update 24h stats
      depth.volume24h += order.quantity
      depth.high24h = Math.max(depth.high24h, order.price)
      depth.low24h = depth.low24h === 0 ? order.price : Math.min(depth.low24h, order.price)
    } else {
      // Add to buy orders
      const existingBuy = depth.buyOrders.find(buy => buy.price === order.price)
      if (existingBuy) {
        existingBuy.quantity += order.quantity
        existingBuy.count += 1
      } else {
        depth.buyOrders.push({ price: order.price, quantity: order.quantity, count: 1 })
        depth.buyOrders.sort((a, b) => b.price - a.price) // Sort by price descending
      }
    }
  } else {
    // Find matching buy orders
    const matchingBuy = depth.buyOrders.find(buy => buy.price >= order.price)
    if (matchingBuy && matchingBuy.quantity >= order.quantity) {
      order.status = 'filled'
      order.price = matchingBuy.price
      
      // Update market depth
      matchingBuy.quantity -= order.quantity
      if (matchingBuy.quantity === 0) {
        depth.buyOrders = depth.buyOrders.filter(b => b !== matchingBuy)
      }
      
      // Update last trade
      depth.lastTrade = {
        price: order.price,
        quantity: order.quantity,
        timestamp: new Date().toISOString()
      }
      
      // Update 24h stats
      depth.volume24h += order.quantity
      depth.high24h = Math.max(depth.high24h, order.price)
      depth.low24h = depth.low24h === 0 ? order.price : Math.min(depth.low24h, order.price)
    } else {
      // Add to sell orders
      const existingSell = depth.sellOrders.find(sell => sell.price === order.price)
      if (existingSell) {
        existingSell.quantity += order.quantity
        existingSell.count += 1
      } else {
        depth.sellOrders.push({ price: order.price, quantity: order.quantity, count: 1 })
        depth.sellOrders.sort((a, b) => a.price - b.price) // Sort by price ascending
      }
    }
  }

  return order
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const crop = searchParams.get("crop")
  const type = searchParams.get("type") // 'orders', 'depth', 'trades'

  try {
    switch (type) {
      case 'orders':
        let filteredOrders = tradingOrders
        if (crop) {
          filteredOrders = tradingOrders.filter(order => order.crop === crop)
        }
        
        return NextResponse.json({
          orders: filteredOrders,
          total: filteredOrders.length,
          timestamp: new Date().toISOString()
        })

      case 'depth':
        if (!crop) {
          return NextResponse.json({ error: 'Crop parameter is required for market depth' }, { status: 400 })
        }
        
        initializeMarketDepth(crop)
        return NextResponse.json({
          marketDepth: marketDepth[crop],
          timestamp: new Date().toISOString()
        })

      case 'trades':
        const recentTrades = tradingOrders
          .filter(order => order.status === 'filled')
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 50) // Last 50 trades
        
        if (crop) {
          return NextResponse.json({
            trades: recentTrades.filter(trade => trade.crop === crop),
            timestamp: new Date().toISOString()
          })
        }
        
        return NextResponse.json({
          trades: recentTrades,
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({
          message: "Trading API endpoints",
          endpoints: {
            orders: "/api/market/trading?type=orders",
            depth: "/api/market/trading?type=depth&crop=wheat",
            trades: "/api/market/trading?type=trades"
          },
          timestamp: new Date().toISOString()
        })
    }
  } catch (error) {
    console.error("Trading API error:", error)
    return NextResponse.json({ error: "Failed to fetch trading data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, orderData, crop } = body

    switch (action) {
      case 'place_order':
        if (!orderData) {
          return NextResponse.json({ error: 'Order data is required' }, { status: 400 })
        }

        const newOrder: TradingOrder = {
          id: `order_${Date.now()}`,
          crop: orderData.crop,
          type: orderData.type,
          quantity: orderData.quantity,
          price: orderData.price,
          status: 'pending',
          timestamp: new Date().toISOString(),
          trader: orderData.trader || 'anonymous'
        }

        // Process the order
        const processedOrder = processOrder(newOrder)
        tradingOrders.push(processedOrder)

        // Initialize market depth if needed
        initializeMarketDepth(orderData.crop)

        return NextResponse.json({
          message: 'Order placed successfully',
          order: processedOrder,
          timestamp: new Date().toISOString()
        })

      case 'cancel_order':
        const orderId = orderData.id
        const orderIndex = tradingOrders.findIndex(order => order.id === orderId)
        
        if (orderIndex === -1) {
          return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        if (tradingOrders[orderIndex].status === 'filled') {
          return NextResponse.json({ error: 'Cannot cancel filled order' }, { status: 400 })
        }

        tradingOrders[orderIndex].status = 'cancelled'
        
        return NextResponse.json({
          message: 'Order cancelled successfully',
          order: tradingOrders[orderIndex],
          timestamp: new Date().toISOString()
        })

      case 'get_order_status':
        const statusOrderId = orderData.id
        const statusOrder = tradingOrders.find(order => order.id === statusOrderId)
        
        if (!statusOrder) {
          return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        return NextResponse.json({
          order: statusOrder,
          timestamp: new Date().toISOString()
        })

      case 'simulate_trading':
        // Generate random trading activity for demonstration
        const crops = ['wheat', 'rice', 'cotton', 'sugarcane']
        const randomCrop = crops[Math.floor(Math.random() * crops.length)]
        const randomType = Math.random() > 0.5 ? 'buy' : 'sell'
        const randomQuantity = Math.floor(Math.random() * 100) + 10
        const basePrice = randomCrop === 'wheat' ? 2150 : 
                         randomCrop === 'rice' ? 3200 :
                         randomCrop === 'cotton' ? 6800 : 380
        const randomPrice = Math.round(basePrice * (0.95 + Math.random() * 0.1))

        const simulatedOrder: TradingOrder = {
          id: `sim_${Date.now()}`,
          crop: randomCrop,
          type: randomType,
          quantity: randomQuantity,
          price: randomPrice,
          status: 'pending',
          timestamp: new Date().toISOString(),
          trader: 'simulator'
        }

        const processedSimOrder = processOrder(simulatedOrder)
        tradingOrders.push(processedSimOrder)
        initializeMarketDepth(randomCrop)

        return NextResponse.json({
          message: 'Trading simulation completed',
          order: processedSimOrder,
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error("Trading API POST error:", error)
    return NextResponse.json({ error: "Failed to process trading request" }, { status: 500 })
  }
}
