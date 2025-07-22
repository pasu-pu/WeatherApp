import "./WeatherCard.css"

function WeatherCard({ weather, units }) {
  if (!weather) return null

  const temperature = units === "celsius" ? Math.round(weather.main.temp) : Math.round((weather.main.temp * 9) / 5 + 32)

  const feelsLike =
    units === "celsius" ? Math.round(weather.main.feels_like) : Math.round((weather.main.feels_like * 9) / 5 + 32)

  const unitSymbol = units === "celsius" ? "°C" : "°F"

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>
          {weather.name}, {weather.sys.country}
        </h2>
        <div className="weather-main">
          <img
            src={getWeatherIcon(weather.weather[0].icon) || "/placeholder.svg"}
            alt={weather.weather[0].description}
            className="weather-icon"
          />
          <div className="temperature">
            <span className="temp-value">{temperature}</span>
            <span className="temp-unit">{unitSymbol}</span>
          </div>
        </div>
      </div>

      <div className="weather-description">
        <p>{weather.weather[0].description}</p>
        <p>
          Feels like {feelsLike}
          {unitSymbol}
        </p>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{weather.main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{weather.wind.speed} m/s</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{weather.main.pressure} hPa</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Visibility</span>
          <span className="detail-value">{weather.visibility / 1000} km</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
