"use client"

import { useState, useEffect } from "react"
import { useWeather } from "../../contexts/WeatherContext"
import { useTheme } from "../../contexts/ThemeContext"
import ForecastCard from "./ForecastCard"
import SearchBar from "../Weather/SearchBar"
import Toast from "../UI/Toast"
import LoadingSpinner from "../UI/LoadingSpinner"
import "./Forecast.css"

function Forecast() {
  const { forecast, loading, error, fetchForecast, currentWeather } = useWeather()
  const { units, translate } = useTheme()
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (currentWeather && !forecast) {
      fetchForecast(currentWeather.name)
    }
  }, [currentWeather, forecast, fetchForecast])

  const handleCitySearch = async (city) => {
    try {
      await fetchForecast(city)
      setToast({ type: "success", message: `${translate("fiveDayForecast")} loaded for ${city}` })
    } catch (err) {
      setToast({ type: "error", message: err.message })
    }
  }

  const groupForecastByDay = (forecastData) => {
    if (!forecastData) return []

    const grouped = {}
    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString()
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(item)
    })

    return Object.entries(grouped).slice(0, 5)
  }

  const groupedForecast = groupForecastByDay(forecast)

  return (
    <div className="forecast-container">
      <div className="forecast-header">
        <h1>{translate("fiveDayForecast")}</h1>
        <p>{translate("detailedPredictions")}</p>
      </div>

      <div className="forecast-search">
        <SearchBar onSearch={handleCitySearch} />
      </div>

      {loading && <LoadingSpinner />}

      {forecast && (
        <div className="forecast-content">
          <div className="forecast-location">
            <h2>
              {forecast.city.name}, {forecast.city.country}
            </h2>
          </div>

          <div className="forecast-grid">
            {groupedForecast.map(([date, dayForecast], index) => (
              <div key={date} className="forecast-day">
                <h3 className="day-header">
                  {index === 0
                    ? translate("today")
                    : new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                </h3>
                <div className="day-forecast">
                  {dayForecast.map((item, itemIndex) => (
                    <ForecastCard key={item.dt} forecast={item} units={units} isFirst={itemIndex === 0} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Forecast
