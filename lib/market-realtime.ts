// Real-time market data client utilities
export interface MarketPrice {
  crop: string
  name: string
  currentPrice: number
  change: number
  trend: 'up' | 'down'
  timestamp: string
}

export interface MarketAlert {
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

export interface TradingOrder {
  id: string
  crop: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  status: 'pending' | 'filled' | 'cancelled'
  timestamp: string
  trader: string
}

export class MarketRealtimeClient {
  private baseUrl: string
  private updateInterval: number
  private isPolling: boolean = false
  private pollingId: NodeJS.Timeout | null = null
  private listeners: Map<string, Function[]> = new Map()

  constructor(baseUrl: string = '/api/market', updateInterval: number = 5000) {
    this.baseUrl = baseUrl
    this.updateInterval = updateInterval
  }

  // Event listener management
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(callback)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data))
    }
  }

  // Start real-time polling
  startPolling(crop?: string) {
    if (this.isPolling) return

    this.isPolling = true
    this.pollingId = setInterval(async () => {
      try {
        const url = crop 
          ? `${this.baseUrl}?realtime=true&crop=${crop}`
          : `${this.baseUrl}?realtime=true`
        
        const response = await fetch(url)
        const data = await response.json()
        
        this.emit('priceUpdate', data)
        
        if (crop && data.crop) {
          this.emit('cropUpdate', data.crop)
        } else if (data.crops) {
          this.emit('marketUpdate', data.crops)
        }
      } catch (error) {
        this.emit('error', error)
        console.error('Real-time polling error:', error)
      }
    }, this.updateInterval)

    this.emit('pollingStarted', { crop, interval: this.updateInterval })
  }

  // Stop real-time polling
  stopPolling() {
    if (this.pollingId) {
      clearInterval(this.pollingId)
      this.pollingId = null
    }
    this.isPolling = false
    this.emit('pollingStopped', {})
  }

  // Get live market data
  async getLiveData(crop?: string): Promise<any> {
    try {
      const url = crop 
        ? `${this.baseUrl}?realtime=true&crop=${crop}`
        : `${this.baseUrl}?realtime=true`
      
      const response = await fetch(url)
      return await response.json()
    } catch (error) {
      console.error('Error fetching live data:', error)
      throw error
    }
  }

  // Get live prices only
  async getLivePrices(): Promise<MarketPrice[]> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_live_prices' })
      })
      
      const data = await response.json()
      return data.prices || []
    } catch (error) {
      console.error('Error fetching live prices:', error)
      throw error
    }
  }

  // Subscribe to real-time updates
  async subscribe(crop?: string, filters?: any): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'subscribe',
          crop,
          filters 
        })
      })
      
      const data = await response.json()
      return data.subscriptionId
    } catch (error) {
      console.error('Error subscribing:', error)
      throw error
    }
  }

  // Unsubscribe from real-time updates
  async unsubscribe(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unsubscribe' })
      })
    } catch (error) {
      console.error('Error unsubscribing:', error)
      throw error
    }
  }

  // Set price alert
  async setPriceAlert(crop: string, targetPrice: number, condition: 'above' | 'below'): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_price_alert',
          crop,
          priceAlert: {
            targetPrice,
            condition
          }
        })
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error setting price alert:', error)
      throw error
    }
  }

  // Get market alerts
  async getAlerts(crop?: string, type?: string, priority?: string): Promise<MarketAlert[]> {
    try {
      const params = new URLSearchParams()
      if (crop) params.append('crop', crop)
      if (type) params.append('type', type)
      if (priority) params.append('priority', priority)
      
      const response = await fetch(`${this.baseUrl}/alerts?${params}`)
      const data = await response.json()
      return data.alerts || []
    } catch (error) {
      console.error('Error fetching alerts:', error)
      throw error
    }
  }

  // Create custom alert
  async createAlert(alertData: Partial<MarketAlert>): Promise<MarketAlert> {
    try {
      const response = await fetch(`${this.baseUrl}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_alert',
          alertData
        })
      })
      
      const data = await response.json()
      return data.alert
    } catch (error) {
      console.error('Error creating alert:', error)
      throw error
    }
  }

  // Get trading data
  async getTradingData(type: 'orders' | 'depth' | 'trades', crop?: string): Promise<any> {
    try {
      const params = new URLSearchParams({ type })
      if (crop) params.append('crop', crop)
      
      const response = await fetch(`${this.baseUrl}/trading?${params}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching trading data:', error)
      throw error
    }
  }

  // Place trading order
  async placeOrder(orderData: Partial<TradingOrder>): Promise<TradingOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/trading`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'place_order',
          orderData
        })
      })
      
      const data = await response.json()
      return data.order
    } catch (error) {
      console.error('Error placing order:', error)
      throw error
    }
  }

  // Simulate trading activity
  async simulateTrading(): Promise<TradingOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/trading`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate_trading'
        })
      })
      
      const data = await response.json()
      return data.order
    } catch (error) {
      console.error('Error simulating trading:', error)
      throw error
    }
  }

  // Cleanup
  destroy() {
    this.stopPolling()
    this.listeners.clear()
  }
}

// React hook for real-time market data
export function useMarketRealtime(crop?: string, updateInterval: number = 5000) {
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [isPolling, setIsPolling] = React.useState(false)

  const client = React.useMemo(() => new MarketRealtimeClient('/api/market', updateInterval), [updateInterval])

  React.useEffect(() => {
    // Set up event listeners
    const handlePriceUpdate = (newData: any) => {
      setData(newData)
      setLoading(false)
    }

    const handleError = (err: Error) => {
      setError(err)
      setLoading(false)
    }

    const handlePollingStarted = () => setIsPolling(true)
    const handlePollingStopped = () => setIsPolling(false)

    client.on('priceUpdate', handlePriceUpdate)
    client.on('error', handleError)
    client.on('pollingStarted', handlePollingStarted)
    client.on('pollingStopped', handlePollingStopped)

    // Start polling
    client.startPolling(crop)

    // Cleanup
    return () => {
      client.off('priceUpdate', handlePriceUpdate)
      client.off('error', handleError)
      client.off('pollingStarted', handlePollingStarted)
      client.off('pollingStopped', handlePollingStopped)
      client.destroy()
    }
  }, [client, crop])

  return {
    data,
    loading,
    error,
    isPolling,
    client
  }
}

// Export default client instance
export const marketClient = new MarketRealtimeClient()
