"use client"

import { useState } from "react"
import Calendar from "./Calendar"
import WeatherOverlay from "./WeatherOverlay"
import EventsList from "./EventsList"
import "./Planner.css"

function Planner() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedDateWeather, setSelectedDateWeather] = useState(null)

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    // In a real app, fetch weather for selected date
    setSelectedDateWeather({
      temp: Math.floor(Math.random() * 30) + 5,
      condition: ["sunny", "cloudy", "rainy"][Math.floor(Math.random() * 3)],
      description: "Partly cloudy",
    })
  }

  return (
    <div className="planner-container">
      <div className="planner-header">
        <h1>Weather Planner</h1>
        <p>Plan your activities with weather and calendar integration</p>
      </div>

      <div className="planner-content">
        <div className="calendar-section">
          <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
        </div>

        <div className="details-section">
          <div className="date-info">
            <h2>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
          </div>

          {selectedDateWeather && <WeatherOverlay weather={selectedDateWeather} />}

          <EventsList date={selectedDate} />

          <div className="activity-suggestions">
            <h3>💡 Suggested Activities</h3>
            <div className="suggestions-list">
              <div className="suggestion-item">🚴 Morning bike ride (Weather looks great!)</div>
              <div className="suggestion-item">☕ Afternoon coffee meeting</div>
              <div className="suggestion-item">🎬 Evening movie (Indoor backup plan)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Planner
