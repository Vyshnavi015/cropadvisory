import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const city = searchParams.get("city")

  if (!process.env.OPENWEATHER_API_KEY) {
    return NextResponse.json({ error: "Weather API key not configured" }, { status: 500 })
  }

  try {
    let forecastUrl = ""

    if (lat && lon) {
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    } else if (city) {
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    } else {
      // Default to Ludhiana, Punjab
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Ludhiana,IN&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    }

    const response = await fetch(forecastUrl)

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`)
    }

    const data = await response.json()

    // Process 5-day forecast data
    const dailyForecasts = processForecastData(data.list)

    const forecastData = {
      location: {
        name: data.city.name,
        country: data.city.country,
        coordinates: {
          lat: data.city.coord.lat,
          lon: data.city.coord.lon,
        },
      },
      forecast: dailyForecasts,
      farmingInsights: generateFarmingInsights(dailyForecasts),
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(forecastData)
  } catch (error) {
    console.error("Forecast API error:", error)
    return NextResponse.json({ error: "Failed to fetch forecast data" }, { status: 500 })
  }
}

function processForecastData(forecastList: any[]) {
  const dailyData: { [key: string]: any[] } = {}

  // Group forecasts by date
  forecastList.forEach((item) => {
    const date = item.dt_txt.split(" ")[0]
    if (!dailyData[date]) {
      dailyData[date] = []
    }
    dailyData[date].push(item)
  })

  // Process each day
  return Object.entries(dailyData)
    .slice(0, 7)
    .map(([date, dayData]) => {
      const temps = dayData.map((item) => item.main.temp)
      const humidity = dayData.map((item) => item.main.humidity)
      const rainfall = dayData.reduce((sum, item) => sum + (item.rain?.["3h"] || 0), 0)

      return {
        date,
        temperature: {
          min: Math.round(Math.min(...temps)),
          max: Math.round(Math.max(...temps)),
          avg: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
        },
        humidity: Math.round(humidity.reduce((a, b) => a + b, 0) / humidity.length),
        rainfall: Math.round(rainfall * 10) / 10, // Round to 1 decimal
        description: dayData[Math.floor(dayData.length / 2)].weather[0].description,
        icon: dayData[Math.floor(dayData.length / 2)].weather[0].icon,
        windSpeed: dayData[Math.floor(dayData.length / 2)].wind.speed,
        farming: {
          irrigationNeeded: temps.some((t) => t > 32) && rainfall < 5,
          sprayingSuitable:
            !dayData.some((item) => item.weather[0].main.includes("Rain")) &&
            dayData[Math.floor(dayData.length / 2)].wind.speed < 8,
          harvestSuitable: !dayData.some((item) => item.weather[0].main.includes("Rain")),
        },
      }
    })
}

function generateFarmingInsights(forecast: any[]) {
  const insights = []

  // Check for upcoming rain
  const rainyDays = forecast.filter((day) => day.rainfall > 2)
  if (rainyDays.length > 0) {
    insights.push({
      type: "weather",
      priority: "high",
      message: `Rain expected on ${rainyDays.length} days. Plan irrigation accordingly and protect crops if heavy rainfall is forecasted.`,
    })
  }

  // Check for hot weather
  const hotDays = forecast.filter((day) => day.temperature.max > 35)
  if (hotDays.length > 0) {
    insights.push({
      type: "irrigation",
      priority: "medium",
      message: `${hotDays.length} hot days ahead. Increase irrigation frequency and consider shade protection for sensitive crops.`,
    })
  }

  // Check for good spraying conditions
  const sprayingDays = forecast.filter((day) => day.farming.sprayingSuitable)
  if (sprayingDays.length > 0) {
    insights.push({
      type: "spraying",
      priority: "low",
      message: `Good spraying conditions on ${sprayingDays.length} days. Plan pest control and fertilizer applications.`,
    })
  }

  return insights
}
