import { useState, useEffect } from "react"
import { useCalendar } from "../../contexts/CalendarContext"
import { useWeather } from "../../contexts/WeatherContext"
import { useTheme } from "../../contexts/ThemeContext"
import Calendar from "./Calendar"
import WeatherOverlay from "./WeatherOverlay"
import EventsList from "./EventsList"
import AddEventModal from "./AddEventModal"
import Toast from "../UI/Toast"
import LoadingSpinner from "../UI/LoadingSpinner"
import ActivitySuggestions from "../Activities/ActivitySuggestions"
import "./Planner.css"


function Planner() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [toast, setToast] = useState(null)
  const [monthEvents, setMonthEvents] = useState({})
  const [reloadTrigger, setReloadTrigger] = useState(0)

  const { isInitialized, fetchEventsForMonth, isAuthorized } = useCalendar()
  const { currentWeather } = useWeather()
  const { translate } = useTheme()

  useEffect(() => {
    const loadMonthEvents = async () => {
      if (!isInitialized || !isAuthorized) {
        setMonthEvents({})
        return
      }
      try {
        const events = await fetchEventsForMonth(selectedDate)
        const eventsByDate = {}
        events.forEach((event) => {
          const eventDate = new Date(event.start.dateTime || event.start.date).toDateString()
          if (!eventsByDate[eventDate]) eventsByDate[eventDate] = []
          eventsByDate[eventDate].push(event)
        })
        setMonthEvents(eventsByDate)
      } catch (error) {
        console.error("Error loading month events:", error)
      }
    }
    loadMonthEvents()
  }, [selectedDate, isInitialized, isAuthorized, fetchEventsForMonth, reloadTrigger])

  const handleDateSelect = (date) => setSelectedDate(date)

  const handleActivitySelected = (activity) => {
    setSelectedActivity(activity.title || activity)
    setShowAddEventModal(true)
  }

  // RICHTIG: Diese Funktion schließt das Modal und macht den Reload!
  const handleEventAdded = () => {
    console.log("handleEventAdded() called");
    setReloadTrigger(r => r + 1)
    setShowAddEventModal(false)
    setSelectedActivity(null)
  }

  const handleCloseModal = () => {
    setShowAddEventModal(false)
    setSelectedActivity(null)
  }

  if (!isInitialized) {
    return (
      <div className="planner-container">
        <div className="planner-header">
          <h1>{translate("weatherPlanner") || "Weather Planner"}</h1>
          <p>{translate("planActivities")}</p>
        </div>
        <div className="loading-container">
          <LoadingSpinner />
          <p>{translate("loading")}...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="planner-container">
      <div className="planner-header">
        <h1>{translate("weatherPlanner") || "Weather Planner"}</h1>
        <p>{translate("planActivities")}</p>
      </div>

      <div className="planner-content">
        <div className="calendar-section">
          <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} events={monthEvents} />
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
          {currentWeather && (
            <WeatherOverlay weather={{
              temp: currentWeather.main.temp,
              condition: currentWeather.weather[0].main.toLowerCase(),
              description: currentWeather.weather[0].description,
              icon: currentWeather.weather[0].icon,
              city: currentWeather.name,
              country: currentWeather.sys.country
            }} />
          )}
          <EventsList date={selectedDate} reloadTrigger={reloadTrigger} />

          <div className="activity-suggestions">
            <ActivitySuggestions
              weather={currentWeather}
              selectedDate={selectedDate}
              onActivitySelected={handleActivitySelected}
              onEventAdded={handleEventAdded}
            />
          </div>
        </div>
      </div>
      {showAddEventModal && (
        <AddEventModal
          isOpen={showAddEventModal}
          activity={selectedActivity}
          selectedDate={selectedDate}
          onClose={handleCloseModal}
          onEventAdded={handleEventAdded}  // << WICHTIG: Modal schließt nicht sich selbst!
        />
      )}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Planner
