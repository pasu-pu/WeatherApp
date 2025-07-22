"use client"

import { useState } from "react"
import "./Calendar.css"

function Calendar({ selectedDate, onDateSelect, events = {} }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(currentMonth.getMonth() + direction)
    setCurrentMonth(newMonth)
  }

  const handleDayClick = (day) => {
    if (day) {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      onDateSelect(newDate)
    }
  }

  const isSelectedDate = (day) => {
    if (!day || !selectedDate) return false
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return dayDate.toDateString() === selectedDate.toDateString()
  }

  const isToday = (day) => {
    if (!day) return false
    const today = new Date()
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return dayDate.toDateString() === today.toDateString()
  }

  const hasEvents = (day) => {
    if (!day) return false
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString()
    return events[dayDate] && events[dayDate].length > 0
  }

  const days = generateCalendarDays()

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="nav-button" onClick={() => navigateMonth(-1)}>
          ‹
        </button>
        <h2>
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button className="nav-button" onClick={() => navigateMonth(1)}>
          ›
        </button>
      </div>

      <div className="calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day ? "clickable" : "empty"} ${
              isSelectedDate(day) ? "selected" : ""
            } ${isToday(day) ? "today" : ""} ${hasEvents(day) ? "has-events" : ""}`}
            onClick={() => handleDayClick(day)}
          >
            {day}
            {hasEvents(day) && <div className="event-indicator"></div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Calendar
