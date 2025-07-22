import "./ForecastCard.css"

function ForecastCard({ forecast, units, isFirst }) {
  const temperature =
    units === "celsius" ? Math.round(forecast.main.temp) : Math.round((forecast.main.temp * 9) / 5 + 32)

  const unitSymbol = units === "celsius" ? "°C" : "°F"

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className={`forecast-card ${isFirst ? "forecast-card-featured" : ""}`}>
      <div className="forecast-time">{formatTime(forecast.dt)}</div>

      <div className="forecast-weather">
        <img
          src={getWeatherIcon(forecast.weather[0].icon) || "/placeholder.svg"}
          alt={forecast.weather[0].description}
          className="forecast-icon"
        />
        <div className="forecast-temp">
          {temperature}
          {unitSymbol}
        </div>
      </div>

      <div className="forecast-description">{forecast.weather[0].description}</div>

      <div className="forecast-details">
        <div className="detail">
          <span>💨</span>
          <span>{forecast.wind.speed} m/s</span>
        </div>
        <div className="detail">
          <span>💧</span>
          <span>{forecast.main.humidity}%</span>
        </div>
      </div>
    </div>
  )
}

export default ForecastCard
