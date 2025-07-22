"use client"

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
import "./Planner.css"

function Planner() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedDateWeather, setSelectedDateWeather] = useState(null)
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [toast, setToast] = useState(null)
  const [monthEvents, setMonthEvents] = useState({})

  const { isInitialized, fetchEventsForMonth, isAuthorized } = useCalendar()
  const { currentWeather } = useWeather()
  const { translate, units } = useTheme()

  // Load month events when calendar is ready and authorized
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
          if (!eventsByDate[eventDate]) {
            eventsByDate[eventDate] = []
          }
          eventsByDate[eventDate].push(event)
        })

        setMonthEvents(eventsByDate)
      } catch (error) {
        console.error("Error loading month events:", error)
      }
    }

    loadMonthEvents()
  }, [selectedDate, isInitialized, isAuthorized, fetchEventsForMonth])

  // Set weather data for selected date
  useEffect(() => {
    if (currentWeather) {
      setSelectedDateWeather({
        temp: currentWeather.main.temp,
        condition: currentWeather.weather[0].main.toLowerCase(),
        description: currentWeather.weather[0].description,
        icon: currentWeather.weather[0].icon,
      })
    }
  }, [currentWeather])

  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  const getSuggestedActivities = () => {
    if (!selectedDateWeather) return []

    const temp = selectedDateWeather.temp
    const condition = selectedDateWeather.condition

    if (condition.includes("rain") || condition.includes("storm")) {
      return [
        { icon: "☕", title: translate("visitCafe"), description: "Enjoy a warm drink while it rains" },
        { icon: "🎬", title: translate("watchMovie"), description: "Perfect weather for cinema" },
        { icon: "📚", title: translate("readLibrary"), description: "Quiet time with a good book" },
        { icon: "🎨", title: translate("visitMuseum"), description: "Explore art and culture indoors" },
      ]
    } else if (temp > 20) {
      return [
        { icon: "🚴", title: translate("goCycling"), description: "Great weather for outdoor exercise" },
        { icon: "🏃", title: translate("outdoorJogging"), description: "Enjoy the nice temperature" },
        { icon: "🌳", title: translate("walkPark"), description: "Enjoy nature in good weather" },
        { icon: "🏖️", title: translate("beachActivities"), description: "If there's a beach nearby" },
      ]
    } else {
      return [
        { icon: "🛍️", title: translate("shoppingMall"), description: "Comfortable indoor activity" },
        { icon: "🎯", title: translate("indoorActivities"), description: "Try bowling or an escape room" },
        { icon: "☕", title: translate("cafeHopping"), description: "Explore local coffee shops" },
        { icon: "🎮", title: translate("gamingSession"), description: "Stay in and play some games" },
      ]
    }
  }

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity.title)
    setShowAddEventModal(true)
  }

  const handleCloseModal = () => {
    setShowAddEventModal(false)
    setSelectedActivity(null)
  }

  // Show loading while calendar is initializing
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

          {selectedDateWeather && <WeatherOverlay weather={selectedDateWeather} />}

          <EventsList date={selectedDate} />

          <div className="activity-suggestions">
            <h3>💡 {translate("suggestedActivities")}</h3>
            <div className="suggestions-list">
              {getSuggestedActivities().map((activity, index) => (
                <div key={index} className="suggestion-item" onClick={() => handleActivitySelect(activity)}>
                  <span className="suggestion-icon">{activity.icon}</span>
                  <div className="suggestion-content">
                    <div className="suggestion-title">{activity.title}</div>
                    <div className="suggestion-description">{activity.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAddEventModal && (
        <AddEventModal
          isOpen={showAddEventModal}
          activity={selectedActivity}
          selectedDate={selectedDate}
          onClose={handleCloseModal}
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Planner
