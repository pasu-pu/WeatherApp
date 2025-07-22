"use client"

import { useState } from "react"
import ActivityModal from "./ActivityModal"

function ActivitySuggestions({ weather, selectedDate }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState("")

  const getSuggestions = () => {
    if (!weather) return []

    const temp = weather.main ? weather.main.temp : weather.temp || 20
    const condition = weather.weather ? weather.weather[0].main.toLowerCase() : weather.condition || "clear"

    if (condition.includes("rain")) {
      return [
        "☕ Visit a cozy café",
        "🎬 Watch a movie at cinema",
        "📚 Read at the library",
        "🎨 Visit a museum",
        "🛍️ Indoor shopping",
        "🎮 Gaming session"
      ]
    } else if (temp > 20) {
      return [
        "🚴 Go cycling in the park",
        "🏃 Outdoor jogging",
        "🌳 Walk in nature",
        "🏖️ Beach activities",
        "⛳ Play golf",
        "🧺 Have a picnic"
      ]
    } else {
      return [
        "🛍️ Shopping mall visit",
        "🎯 Indoor activities",
        "☕ Café hopping",
        "🎮 Gaming session",
        "🎬 Movie marathon",
        "📖 Reading time"
      ]
    }
  }

  const suggestions = getSuggestions()

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity)
    setModalOpen(true)
  }

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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "var(--bg-secondary)"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "var(--bg-tertiary)"
            }}
            onClick={() => handleActivityClick(suggestion)}
          >
            <span>{suggestion}</span>
            <span style={{ fontSize: "12px", opacity: "0.7" }}>Click to add →</span>
          </div>
        ))}
      </div>

      <ActivityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        activity={selectedActivity}
        selectedDate={selectedDate}
      />
    </div>
  )
}

export default ActivitySuggestions
