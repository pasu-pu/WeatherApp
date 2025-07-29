import React, { useState } from "react"
import AddEventModal from "../Planner/AddEventModal"
import { useTheme } from "../../contexts/ThemeContext"
import "./ActivitySuggestions.css"

function ActivitySuggestions({ weather, selectedDate, onEventAdded }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState("")
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { translate } = useTheme()

  const getAiSuggestions = async () => {
    setLoading(true)
    setError(null)
    setAiSuggestions([])


    const city = weather?.name || ""
    const country = weather?.sys?.country || ""
    const locationString = city + (country ? `, ${country}` : "")
    const dateString = selectedDate
      ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : ""
    const weatherDesc = weather
      ? `${weather.temp ? `Temperature: ${weather.temp}°C, ` : ""}${weather.condition || weather.description || ""
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
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
      const match = text.match(/\[.*\]/s)
      if (match) {
        suggestions = JSON.parse(match[0])
      }
      setAiSuggestions(suggestions)
      if (suggestions.length === 0) {
        setError("No AI suggestions received.")
      }
    } catch (e) {
      setError("Could not fetch AI suggestions.")
    } finally {
      setLoading(false)
    }
  }

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity.title || activity)
    setModalOpen(true)
  }

  const handleModalEventAdded = () => {
    setModalOpen(false)
    setSelectedActivity("")
    if (onEventAdded) onEventAdded()
  }

  return (
    <div>
      <h3 className="activity-suggestions-header">💡 {translate("activitySuggestions")}</h3>

      <button className="ai-btn" onClick={getAiSuggestions} disabled={loading}>
        {loading ? "Loading..." : "Get AI Suggestions"}
      </button>

      {error && <div className="activity-suggestions-error">{error}</div>}

      <div className="activity-suggestions-list">
        {aiSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="activity-suggestion-item"
            onClick={() => handleActivityClick(suggestion)}
          >
            <span className="activity-suggestion-text">
              {suggestion.icon || ""} {suggestion.title}
            </span>
            <span className="activity-suggestion-action">{translate("clickToAdd")}</span>
          </div>
        ))}
      </div>

      <AddEventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        activity={selectedActivity}
        selectedDate={selectedDate}
        onEventAdded={handleModalEventAdded}
      />
    </div>
  )
}

export default ActivitySuggestions
