"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useCalendar } from "../../contexts/CalendarContext"
import { useTheme } from "../../contexts/ThemeContext"
import { useWeather } from "../../contexts/WeatherContext"
import Toast from "../UI/Toast"
import "./Profile.css"

function Profile() {
  const { user } = useAuth()
  const { isAuthorized, authorizeCalendar, signOutFromCalendar, gapiLoaded, gisLoaded } = useCalendar()
  const { theme, units, language } = useTheme()
  const { recentSearches } = useWeather()
  const [toast, setToast] = useState(null)

  const handleConnectCalendar = async () => {
    if (!gapiLoaded || !gisLoaded) {
      setToast({ type: "error", message: "Google API is still loading. Please try again in a moment." })
      return
    }

    try {
      await authorizeCalendar()
    } catch (error) {
      console.error("Calendar connection error:", error)
      setToast({ type: "error", message: "Failed to connect to Google Calendar" })
    }
  }

  const handleDisconnectCalendar = async () => {
    try {
      await signOutFromCalendar()
    } catch (error) {
      console.error("Calendar disconnection error:", error)
      setToast({ type: "error", message: "Failed to disconnect from Google Calendar" })
    }
  }

  const getConnectionStatus = () => {
    if (!gapiLoaded || !gisLoaded) {
      return "Loading..."
    }
    return isAuthorized ? "Connected" : "Not connected"
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-card user-info">
          <div className="card-header">
            <h2>Account Information</h2>
          </div>
          <div className="card-content">
            <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase() || "U"}</div>
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Name</span>
                <span className="detail-value">{user?.name || "User"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user?.email || "No email provided"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Member Since</span>
                <span className="detail-value">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-card integrations">
          <div className="card-header">
            <h2>Connected Services</h2>
          </div>
          <div className="card-content">
            <div className="integration-item">
              <div className="integration-info">
                <div className="integration-icon">📅</div>
                <div className="integration-details">
                  <h3>Google Calendar</h3>
                  <p>{getConnectionStatus()}</p>
                </div>
              </div>
              <button
                className={`integration-button ${isAuthorized ? "disconnect" : "connect"}`}
                onClick={isAuthorized ? handleDisconnectCalendar : handleConnectCalendar}
                disabled={!gapiLoaded || !gisLoaded}
              >
                {!gapiLoaded || !gisLoaded ? "Loading..." : isAuthorized ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        </div>

        <div className="profile-card preferences">
          <div className="card-header">
            <h2>Your Preferences</h2>
          </div>
          <div className="card-content">
            <div className="preference-item">
              <span className="preference-label">Theme</span>
              <span className="preference-value">{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
            </div>
            <div className="preference-item">
              <span className="preference-label">Temperature Units</span>
              <span className="preference-value">{units === "celsius" ? "Celsius (°C)" : "Fahrenheit (°F)"}</span>
            </div>
            <div className="preference-item">
              <span className="preference-label">Language</span>
              <span className="preference-value">{language === "en" ? "English" : "German"}</span>
            </div>
          </div>
        </div>

        <div className="profile-card recent-searches">
          <div className="card-header">
            <h2>Recent Searches</h2>
          </div>
          <div className="card-content">
            {recentSearches.length > 0 ? (
              <ul className="searches-list">
                {recentSearches.map((city, index) => (
                  <li key={index} className="search-item">
                    <span className="search-icon">📍</span>
                    <span className="search-city">{city}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-searches">No recent searches</p>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Profile
