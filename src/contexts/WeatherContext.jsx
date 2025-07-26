// WeatherContext.js
import { createContext, useContext, useState } from "react"

const WeatherContext = createContext()

export function useWeather() {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider")
  }
  return context
}

export function WeatherProvider({ children }) {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("weathernow_recent_searches")
    return saved ? JSON.parse(saved) : []
  })

  const API_KEY = "fc254cdf610244807748e4e5ebe32615"

  const fetchWeatherByCity = async (city) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      )
      if (!response.ok) {
        throw new Error("City not found")
      }
      const data = await response.json()
      setCurrentWeather(data)

      // Add to recent searches
      const newRecentSearches = [city, ...recentSearches.filter((s) => s !== city)].slice(0, 5)
      setRecentSearches(newRecentSearches)
      localStorage.setItem("weathernow_recent_searches", JSON.stringify(newRecentSearches))

      // Reset forecast for new city!
      setForecast(null)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      )
      if (!response.ok) {
        throw new Error("Weather data not available")
      }
      const data = await response.json()
      setCurrentWeather(data)
      setForecast(null)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // always setForecast, even for the same city!
  const fetchForecast = async (city) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      )
      if (!response.ok) {
        throw new Error("Forecast data not available")
      }
      const data = await response.json()
      setForecast(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    currentWeather,
    forecast,
    loading,
    error,
    recentSearches,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    fetchForecast,
  }

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}
