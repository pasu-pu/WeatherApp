"use client"

import { useState, useEffect } from "react"
import { useCalendar } from "../../contexts/CalendarContext"
import { useTheme } from "../../contexts/ThemeContext"
import "./CalendarSummary.css"

function CalendarSummary({ reload }) {
  const [todayEvents, setTodayEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const { fetchTodayEvents, isAuthorized, authorizeCalendar, isInitialized } = useCalendar()
  const { translate } = useTheme()

  useEffect(() => {
    const loadTodayEvents = async () => {
      if (!isInitialized || !isAuthorized) {
        setTodayEvents([])
        return
      }
      try {
        setLoading(true)
        const events = await fetchTodayEvents()
        setTodayEvents(events || [])
      } catch (error) {
        console.error("Error loading today's events:", error)
        setTodayEvents([])
      } finally {
        setLoading(false)
      }
    }
    loadTodayEvents()
  }, [isAuthorized, isInitialized, fetchTodayEvents, reload])

  const calculateFreeTime = () => {
    if (!todayEvents || todayEvents.length === 0) {
      return translate("allDay") + " " + translate("freeTime")
    }
    // Filter events with dateTime (not all-day events)
    const timeEvents = todayEvents.filter((event) => event.start.dateTime && event.end.dateTime)
    if (timeEvents.length === 0) {
      return translate("allDay") + " " + translate("freeTime") + " (excluding all-day events)"
    }
    // Sort events by start time
    timeEvents.sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime))
    // Calculate total busy time in minutes
    let busyMinutes = 0
    timeEvents.forEach((event) => {
      const start = new Date(event.start.dateTime)
      const end = new Date(event.end.dateTime)
      const duration = (end - start) / (1000 * 60) // convert to minutes
      busyMinutes += duration
    })
    // Calculate free time (assuming 16 waking hours)
    const wakingMinutes = 16 * 60
    const freeMinutes = wakingMinutes - busyMinutes
    if (freeMinutes <= 0) {
      return "Fully booked today"
    }
    const freeHours = Math.floor(freeMinutes / 60)
    const remainingMinutes = Math.round(freeMinutes % 60)
    if (freeHours === 0) {
      return `${remainingMinutes} ${translate("minutes")} ${translate("freeTime")} today`
    } else if (remainingMinutes === 0) {
      return `${freeHours} ${freeHours === 1 ? translate("hour") : translate("hours")} ${translate("freeTime")} ${translate("today")}`
    } else {
      return `${freeHours} ${freeHours === 1 ? translate("hour") : translate("hours")} ${translate("and")} ${remainingMinutes} ${translate("minutes")} ${translate("freeTime")} ${translate("today")}`
    }
  }

  const formatEventTime = (event) => {
    if (event.start.dateTime) {
      const start = new Date(event.start.dateTime)
      return start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return translate("allDay")
    }
  }

  const handleConnectCalendar = async () => {
    await authorizeCalendar()
  }

  if (!isInitialized) {
    return (
      <div className="calendar-summary">
        <h3>📅 {translate("todaysSchedule")}</h3>
        <div className="loading-message">{translate("loading")}...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="calendar-summary">
        <h3>📅 {translate("todaysSchedule")}</h3>
        <div className="loading-message">{translate("loading")} your calendar...</div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="calendar-summary">
        <h3>📅 {translate("todaysSchedule")}</h3>
        <div className="calendar-connect">
          <p>{translate("connectCalendar")}{translate("toCheckSchedule")}</p>
          <button className="connect-button" onClick={handleConnectCalendar}>
            {translate("connectCalendar")}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="calendar-summary">
      <h3>📅 {translate("todaysSchedule")}</h3>

      {todayEvents.length === 0 ? (
        <div className="no-events">{translate("noEvents")} for today</div>
      ) : (
        <div className="events-list">
          {todayEvents.slice(0, 3).map((event, index) => (
            <div key={index} className="event-item">
              <span className="event-time">{formatEventTime(event)}</span>
              <span className="event-title">{event.summary}</span>
            </div>
          ))}
          {todayEvents.length > 3 && <div className="more-events">+{todayEvents.length - 3} more events</div>}
        </div>
      )}

      <div className="free-time-summary">
        <span className="free-time-icon">⏰</span>
        <span className="free-time-text">{calculateFreeTime()}</span>
      </div>
    </div>
  )
}

export default CalendarSummary
