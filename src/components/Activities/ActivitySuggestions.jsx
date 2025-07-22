"use client"

function ActivitySuggestions({ weather }) {
  const getSuggestions = () => {
    if (!weather) return []

    const temp = weather.main.temp
    const condition = weather.weather[0].main.toLowerCase()

    if (condition.includes("rain")) {
      return ["☕ Visit a cozy café", "🎬 Watch a movie", "📚 Read at the library", "🎨 Visit a museum"]
    } else if (temp > 20) {
      return ["🚴 Go cycling", "🏃 Outdoor jogging", "🌳 Walk in the park", "🏖️ Beach activities"]
    } else {
      return ["🛍️ Shopping mall visit", "🎯 Indoor activities", "☕ Café hopping", "🎮 Gaming session"]
    }
  }

  const suggestions = getSuggestions()

  return (
    <div>
      <h3 style={{ marginBottom: "16px", color: "var(--text-primary)" }}>💡 Activity Suggestions</h3>
      <div>
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            style={{
              padding: "12px",
              background: "var(--bg-tertiary)",
              borderRadius: "8px",
              marginBottom: "8px",
              color: "var(--text-primary)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "var(--bg-secondary)"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "var(--bg-tertiary)"
            }}
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivitySuggestions
