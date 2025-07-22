"use client"

import { useEffect, useState } from "react"
import { useCalendar } from "../../contexts/CalendarContext"
import { useTheme } from "../../contexts/ThemeContext"
import "./EventsList.css"

function EventsList({ date }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const { fetchEventsForDate, isAuthorized, authorizeCalendar, isInitialized } = useCalendar()
  const { translate } = useTheme()

  useEffect(() => {
    const loadEvents = async () => {
      if (!isInitialized || !isAuthorized) {
        setEvents([])
        return
      }

      try {
        setLoading(true)
        const fetchedEvents = await fetchEventsForDate(date)
        setEvents(fetchedEvents || [])
      } catch (error) {
        console.error("Error fetching events:", error)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [date, isAuthorized, isInitialized, fetchEventsForDate])

  const getEventIcon = (event) => {
    const summary = event.summary?.toLowerCase() || ""

    if (summary.includes("meeting") || summary.includes("call")) return "💼"
    if (summary.includes("lunch") || summary.includes("dinner") || summary.includes("breakfast")) return "🍽️"
    if (summary.includes("gym") || summary.includes("workout")) return "🏋️"
    if (summary.includes("travel") || summary.includes("flight")) return "✈️"
    if (summary.includes("birthday") || summary.includes("party")) return "🎉"
    if (summary.includes("doctor") || summary.includes("appointment")) return "🏥"
    return "📅"
  }

  const formatEventTime = (event) => {
    if (event.start.dateTime) {
      const start = new Date(event.start.dateTime)
      const end = new Date(event.end.dateTime)
      return `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }
    return translate("allDay")
  }

  const handleConnectCalendar = async () => {
    try {
      await authorizeCalendar()
    } catch (error) {
      console.error("Error connecting calendar:", error)
    }
  }

  if (!isInitialized) {
    return (
      <div className="events-list-container">
        <h3>📅 Your Schedule</h3>
        <div className="events-loading">{translate("loading")} calendar API...</div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="events-list-container">
        <h3>📅 Your Schedule</h3>
        <div className="calendar-connect">
          <p>{translate("connectCalendar")} to see your events</p>
          <button className="connect-button" onClick={handleConnectCalendar}>
            {translate("connectCalendar")}
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="events-list-container">
        <h3>📅 Your Schedule</h3>
        <div className="events-loading">{translate("loading")} events...</div>
      </div>
    )
  }

  return (
    <div className="events-list-container">
      <h3>📅 Your Schedule</h3>

      {events.length === 0 ? (
        <div className="no-events">{translate("noEvents")} for this day</div>
      ) : (
        <div className="events-list">
          {events.map((event, index) => (
            <div key={event.id || index} className="event-item">
              <span className="event-icon">{getEventIcon(event)}</span>
              <div className="event-details">
                <div className="event-title">{event.summary}</div>
                <div className="event-time">{formatEventTime(event)}</div>
                {event.location && <div className="event-location">📍 {event.location}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EventsList
