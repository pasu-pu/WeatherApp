function WeatherOverlay({ weather }) {
  const getWeatherEmoji = (condition) => {
    switch (condition) {
      case "sunny":
        return "☀️"
      case "cloudy":
        return "☁️"
      case "rainy":
        return "🌧️"
      default:
        return "🌤️"
    }
  }

  return (
    <div
      style={{
        background: "var(--gradient-weather)",
        color: "white",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <h3 style={{ marginBottom: "8px" }}>🌤️ Weather Forecast</h3>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "24px" }}>{getWeatherEmoji(weather.condition)}</span>
        <div>
          <div style={{ fontSize: "18px", fontWeight: "600" }}>{weather.temp}°C</div>
          <div style={{ fontSize: "14px", opacity: "0.9" }}>{weather.description}</div>
        </div>
      </div>
    </div>
  )
}

export default WeatherOverlay
