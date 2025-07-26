import React, { useState } from "react"
import "./ActivitySuggestions.css"

function ActivitySuggestions({ weather, selectedDate, onActivitySelected }) {
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getAiSuggestions = async () => {
    setLoading(true)
    setError(null)
    setAiSuggestions([])

    const city = weather?.name || "your city"
    const country = weather?.sys?.country || ""
    const locationString = `${city}${country ? ", " + country : ""}`

    const dateString = selectedDate
      ? selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      : ""

    const weatherDesc = weather
      ? `${weather.temp ? `Temperature: ${weather.temp}°C, ` : ""}${
          weather.condition || weather.description || ""
        }`
      : ""

    const prompt = `Suggest 5 activities for this day in ${locationString}: ${dateString}, Weather: ${weatherDesc}.
Respond as a JSON array: [{"icon":"[emoji]","title":"[short description]"}].
Start every "title" with a capital letter.
Use different, suitable emojis as icons.
Only return the JSON array, nothing else.`

    try {
      const response = await fetch("http://localhost:4000/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()
      let suggestions = []
      try {
        const match = data?.candidates?.[0]?.content?.parts?.[0]?.text.match(/\[.*\]/s)
        suggestions = match ? JSON.parse(match[0]) : []
      } catch {
        suggestions = []
      }
      setAiSuggestions(suggestions)
      if (suggestions.length === 0) setError("No AI suggestions received.")
    } catch {
      setError("Could not fetch AI suggestions.")
      setAiSuggestions([])
    }
    setLoading(false)
  }

  const handleActivityClick = (activity) => {
    if (onActivitySelected) onActivitySelected(activity)
  }

  return (
    <div>
      <h3 style={{ marginBottom: "16px", color: "var(--text-primary)" }}>
        💡 Activity Suggestions
      </h3>
      <button
        className="ai-btn"
        onClick={getAiSuggestions}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get AI Suggestions"}
      </button>
      {error && (
        <div style={{ color: "red", marginBottom: "8px" }}>{error}</div>
      )}

      <div>
        {aiSuggestions.map((suggestion, index) => (
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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-secondary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--bg-tertiary)")
            }
            onClick={() => handleActivityClick(suggestion)}
          >
            <span>
              {suggestion.icon ? suggestion.icon + " " : ""}
              {suggestion.title || suggestion}
            </span>
            <span style={{ fontSize: "12px", opacity: "0.7" }}>
              Click to add →
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivitySuggestions
