import { useState, useEffect } from "react"
import { useCalendar } from "../../contexts/CalendarContext"
import "./AddEventModal.css"

function AddEventModal({ isOpen, onClose, activity, selectedDate, onEventAdded }) {
  const [startTime, setStartTime] = useState("12:00")
  const [duration, setDuration] = useState(60)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const { addEvent, isAuthorized, authorizeCalendar } = useCalendar()

  useEffect(() => {
    if (isOpen) {
      setStartTime("12:00")
      setDuration(60)
      setError(null)
      setIsLoading(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      if (!isAuthorized) {
        const success = await authorizeCalendar()
        if (!success) {
          setError("Please authorize Google Calendar access first")
          setIsLoading(false)
          return
        }
      }
      const [hours, minutes] = startTime.split(":").map(Number)
      const startDateTime = new Date(selectedDate || new Date())
      startDateTime.setHours(hours, minutes, 0, 0)
      const endDateTime = new Date(startDateTime)
      endDateTime.setMinutes(endDateTime.getMinutes() + duration)

      const event = {
        summary: activity,
        description: `Suggested activity: ${activity}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      }

      const result = await addEvent(event)
      if (result) {
        onEventAdded()  // Parent re‑loads and closes modal
      } else {
        setError("Failed to add event to calendar. Please try again.")
      }
    } catch {
      setError("An error occurred while adding the event")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Activity to Calendar</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="activity-form">
          <div className="form-group">
            <label>Activity</label>
            <div className="activity-display">{activity}</div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration</label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Date</label>
            <div className="date-display">
              {(selectedDate || new Date()).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          {error && <div className="form-error">{error}</div>}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add to Calendar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEventModal
