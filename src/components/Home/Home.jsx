// Home.jsx
import { useState, useEffect } from "react"
import { useWeather } from "../../contexts/WeatherContext"
import { useTheme } from "../../contexts/ThemeContext"
import WeatherCard from "../Weather/WeatherCard"
import SearchBar from "../Weather/SearchBar"
import CalendarSummary from "../Calendar/CalendarSummary"
import ActivitySuggestions from "../Activities/ActivitySuggestions"
import Toast from "../UI/Toast"
import LoadingSpinner from "../UI/LoadingSpinner"
import { useNavigate } from "react-router-dom"
import "./Home.css"

function Home() {
  const { currentWeather, loading, error, fetchWeatherByCity, fetchWeatherByCoords } = useWeather()
  const { units, translate } = useTheme()
  const [toast, setToast] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [reload, setReload] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentWeather) {
      handleUseLocation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCitySearch = async (city) => {
    try {
      await fetchWeatherByCity(city)
      setToast({ type: "success", message: `Weather loaded for ${city}` })
    } catch (err) {
      setToast({ type: "error", message: err.message })
    }
  }

  const handleUseLocation = async () => {
    setLocationLoading(true)
    if (!navigator.geolocation) {
      setToast({ type: "error", message: "Geolocation is not supported by this browser" })
      setLocationLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude)
          setToast({ type: "success", message: "Weather loaded for your location" })
        } catch {
          setToast({ type: "error", message: "Failed to get weather for your location" })
        } finally {
          setLocationLoading(false)
        }
      },
      () => {
        setToast({ type: "error", message: "Location access denied" })
        setLocationLoading(false)
      }
    )
  }

  // Warte kurz vor reload (Google ist manchmal langsam!)
  const handleEventAdded = () => {
    setTimeout(() => setReload((r) => !r), 600)
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>{translate("welcome")}</h1>
        <p>{translate("planActivities")}</p>
      </div>

      <div className="search-section">
        <SearchBar onSearch={handleCitySearch} />

        <button
          className="location-button"
          onClick={handleUseLocation}
          disabled={locationLoading}
        >
          {locationLoading ? "Getting location..." : "📍 Use My Location"}
        </button>

        {/* Five‑Day Forecast Button */}
        <button
          className="forecast-button"
          onClick={() => navigate("/forecast")}
        >
          {translate("fiveDayForecast")}
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {currentWeather && (
        <div className="home-content">
          <div className="weather-section">
            <WeatherCard weather={currentWeather} units={units} />
          </div>

          <div className="calendar-section">
            <CalendarSummary reload={reload} />
          </div>

          <div className="suggestions-section">
            <ActivitySuggestions
              weather={currentWeather}
              selectedDate={new Date()}
              onEventAdded={handleEventAdded}
            />
          </div>
        </div>
      )}

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  )
}

export default Home
