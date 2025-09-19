# Real-Time Marketing API Documentation

This document describes the real-time marketing API system that provides live agricultural market data, price updates, alerts, and trading functionality.

## Overview

The real-time marketing API consists of several endpoints that work together to provide:
- Live price updates with realistic market simulation
- Real-time market alerts and notifications
- Live trading data and order book simulation
- WebSocket support for streaming data
- Client-side utilities for easy integration

## API Endpoints

### 1. Market Data API (`/api/market`)

#### GET `/api/market`
Get market data (static or real-time)

**Query Parameters:**
- `crop` (optional): Specific crop to get data for (wheat, rice, cotton, sugarcane)
- `state` (optional): State filter (default: punjab)
- `realtime` (optional): Set to "true" for live data

**Examples:**
```bash
# Get all static market data
GET /api/market

# Get real-time data for all crops
GET /api/market?realtime=true

# Get real-time data for wheat
GET /api/market?realtime=true&crop=wheat
```

#### POST `/api/market`
Real-time market operations

**Actions:**
- `subscribe`: Subscribe to real-time updates
- `unsubscribe`: Unsubscribe from updates
- `set_price_alert`: Set price alerts
- `get_live_prices`: Get current live prices

**Example:**
```javascript
// Subscribe to real-time updates
fetch('/api/market', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'subscribe',
    crop: 'wheat'
  })
})

// Set price alert
fetch('/api/market', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'set_price_alert',
    crop: 'wheat',
    priceAlert: {
      targetPrice: 2200,
      condition: 'above'
    }
  })
})
```

### 2. WebSocket API (`/api/market/websocket`)

#### GET `/api/market/websocket`
Get WebSocket connection information

#### POST `/api/market/websocket`
WebSocket operations

**Actions:**
- `subscribe`: Initiate WebSocket subscription
- `unsubscribe`: Terminate WebSocket subscription

### 3. Market Alerts API (`/api/market/alerts`)

#### GET `/api/market/alerts`
Get market alerts

**Query Parameters:**
- `crop` (optional): Filter by crop
- `type` (optional): Filter by alert type
- `priority` (optional): Filter by priority
- `active` (optional): Filter by active status

#### POST `/api/market/alerts`
Manage market alerts

**Actions:**
- `create_alert`: Create new alert
- `update_alert`: Update existing alert
- `delete_alert`: Delete alert
- `check_price_alerts`: Check for triggered alerts
- `generate_auto_alerts`: Generate automatic alerts

**Example:**
```javascript
// Create price alert
fetch('/api/market/alerts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'create_alert',
    alertData: {
      crop: 'wheat',
      type: 'price_alert',
      condition: 'above',
      targetValue: 2200,
      message: 'Wheat price above ₹2200',
      priority: 'high'
    }
  })
})
```

### 4. Trading API (`/api/market/trading`)

#### GET `/api/market/trading`
Get trading data

**Query Parameters:**
- `type`: Data type (orders, depth, trades)
- `crop` (optional): Filter by crop

#### POST `/api/market/trading`
Trading operations

**Actions:**
- `place_order`: Place trading order
- `cancel_order`: Cancel order
- `get_order_status`: Get order status
- `simulate_trading`: Simulate trading activity

**Example:**
```javascript
// Place buy order
fetch('/api/market/trading', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'place_order',
    orderData: {
      crop: 'wheat',
      type: 'buy',
      quantity: 100,
      price: 2150,
      trader: 'farmer123'
    }
  })
})
```

## Client-Side Usage

### Using the MarketRealtimeClient

```javascript
import { MarketRealtimeClient } from '@/lib/market-realtime'

// Create client instance
const client = new MarketRealtimeClient('/api/market', 5000) // 5 second updates

// Set up event listeners
client.on('priceUpdate', (data) => {
  console.log('Price updated:', data)
})

client.on('error', (error) => {
  console.error('Error:', error)
})

// Start real-time polling
client.startPolling('wheat') // Poll for wheat data

// Get live data
const liveData = await client.getLiveData('wheat')

// Set price alert
await client.setPriceAlert('wheat', 2200, 'above')

// Stop polling
client.stopPolling()
```

### Using React Hook

```javascript
import { useMarketRealtime } from '@/lib/market-realtime'

function MarketComponent() {
  const { data, loading, error, isPolling, client } = useMarketRealtime('wheat', 5000)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>Wheat Market Data</h2>
      <p>Price: ₹{data?.crop?.currentPrice}</p>
      <p>Change: {data?.crop?.change}%</p>
      <p>Status: {isPolling ? 'Live' : 'Stopped'}</p>
    </div>
  )
}
```

## Data Structures

### MarketPrice
```typescript
interface MarketPrice {
  crop: string
  name: string
  currentPrice: number
  change: number
  trend: 'up' | 'down'
  timestamp: string
}
```

### MarketAlert
```typescript
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
```

### TradingOrder
```typescript
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
```

## Real-Time Features

### Price Simulation
- Realistic price fluctuations based on market trends
- 2% volatility with trend multipliers
- Updates every 5 seconds
- Market-specific price variations

### Market Alerts
- Price threshold alerts
- Trend change notifications
- Automatic alert generation
- Priority-based alerting system

### Trading Simulation
- Order book simulation
- Order matching algorithm
- Market depth visualization
- 24-hour trading statistics

### WebSocket Support
- Real-time data streaming
- Event-based updates
- Subscription management
- Connection status monitoring

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages:

- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

Error responses include a descriptive error message:
```json
{
  "error": "Error description",
  "timestamp": "2024-01-18T10:30:00.000Z"
}
```

## Rate Limiting

- Real-time polling: Recommended 5-second intervals
- API calls: No strict limits (adjust based on server capacity)
- WebSocket connections: Monitor concurrent connections

## Security Considerations

- Input validation on all endpoints
- CORS headers for cross-origin requests
- Error message sanitization
- Rate limiting (implement as needed)

## Performance Optimization

- Efficient data structures for real-time updates
- Minimal data transfer with targeted queries
- Client-side caching for static data
- WebSocket compression (when implemented)

## Future Enhancements

- Database integration for persistent data
- User authentication and authorization
- Advanced charting and analytics
- Mobile push notifications
- Integration with external market data providers
- Machine learning price predictions
