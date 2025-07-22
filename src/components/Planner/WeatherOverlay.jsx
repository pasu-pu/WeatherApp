"use client"

import { useTheme } from "../../contexts/ThemeContext"
import "./WeatherOverlay.css"

function WeatherOverlay({ weather }) {
  const { units } = useTheme()

  const getWeatherEmoji = (condition) => {
    switch (condition) {
      case "clear":
        return "☀️"
      case "clouds":
        return "☁️"
      case "rain":
        return "🌧️"
      case "snow":
        return "❄️"
      case "thunderstorm":
        return "⛈️"
      case "drizzle":
        return "🌦️"
      case "mist":
      case "fog":
        return "🌫️"
      default:
        return "🌤️"
    }
  }

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  const convertTemperature = (temp) => {
    if (units === "celsius") {
      return Math.round(temp)
    } else {
      return Math.round((temp * 9) / 5 + 32)
    }
  }

  const getUnitSymbol = () => {
    return units === "celsius" ? "°C" : "°F"
  }

  return (
    <div className="weather-overlay">
      <h3>🌤️ Weather Forecast</h3>
      <div className="weather-content">
        {weather.icon ? (
          <img
            src={getWeatherIcon(weather.icon) || "/placeholder.svg"}
            alt={weather.description}
            className="weather-icon"
          />
        ) : (
          <span className="weather-emoji">{getWeatherEmoji(weather.condition)}</span>
        )}
        <div className="weather-info">
          <div className="weather-temp">
            {convertTemperature(weather.temp)}
            {getUnitSymbol()}
          </div>
          <div className="weather-desc">{weather.description}</div>
        </div>
      </div>
    </div>
  )
}

export default WeatherOverlay
