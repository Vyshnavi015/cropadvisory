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
    let weatherUrl = ""

    if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    } else if (city) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    } else {
      // Default to Ludhiana, Punjab for farming context
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=Ludhiana,IN&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    }

    const response = await fetch(weatherUrl)

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform the data for our farming context
    const weatherData = {
      location: {
        name: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon,
        },
      },
      current: {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        visibility: data.visibility / 1000, // Convert to km
        uvIndex: 0, // Not available in current weather API
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        cloudiness: data.clouds.all,
      },
      farming: {
        soilMoisture: calculateSoilMoisture(data.main.humidity, data.clouds.all),
        irrigationAdvice: getIrrigationAdvice(data.main.temp, data.main.humidity, data.clouds.all),
        pestRisk: getPestRisk(data.main.temp, data.main.humidity),
        fieldWorkSuitability: getFieldWorkSuitability(data.weather[0].main, data.wind.speed),
      },
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}

// Helper functions for farming-specific insights
function calculateSoilMoisture(humidity: number, cloudiness: number): string {
  const moistureLevel = (humidity + cloudiness) / 2
  if (moistureLevel > 70) return "High"
  if (moistureLevel > 40) return "Medium"
  return "Low"
}

function getIrrigationAdvice(temp: number, humidity: number, cloudiness: number): string {
  if (temp > 35 && humidity < 40) {
    return "High irrigation needed due to hot and dry conditions"
  }
  if (temp > 30 && humidity < 50 && cloudiness < 30) {
    return "Moderate irrigation recommended"
  }
  if (cloudiness > 70) {
    return "Reduce irrigation - cloudy conditions expected"
  }
  return "Normal irrigation schedule"
}

function getPestRisk(temp: number, humidity: number): string {
  if (temp > 25 && temp < 35 && humidity > 60) {
    return "High - Ideal conditions for pest development"
  }
  if (temp > 20 && humidity > 50) {
    return "Medium - Monitor crops regularly"
  }
  return "Low - Conditions not favorable for pests"
}

function getFieldWorkSuitability(condition: string, windSpeed: number): string {
  if (condition.includes("rain") || condition.includes("storm")) {
    return "Not suitable - Weather conditions unsafe"
  }
  if (windSpeed > 10) {
    return "Limited - High winds may affect spraying"
  }
  return "Suitable - Good conditions for field work"
}
