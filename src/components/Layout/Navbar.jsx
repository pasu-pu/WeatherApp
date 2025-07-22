"use client"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useTheme } from "../../contexts/ThemeContext"
import "./Navbar.css"

function Navbar() {
  const { logout, user } = useAuth()
  const { theme, units, language, toggleTheme, toggleUnits, toggleLanguage } = useTheme()
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>WeatherNow</h2>
      </div>

      <div className="navbar-nav">
        <Link to="/home" className={`nav-link ${location.pathname === "/home" ? "active" : ""}`}>
          Home
        </Link>
        <Link to="/forecast" className={`nav-link ${location.pathname === "/forecast" ? "active" : ""}`}>
          Forecast
        </Link>
        <Link to="/planner" className={`nav-link ${location.pathname === "/planner" ? "active" : ""}`}>
          Planner
        </Link>
      </div>

      <div className="navbar-controls">
        <button
          className="control-button"
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <button
          className="control-button"
          onClick={toggleUnits}
          title={`Switch to ${units === "celsius" ? "Fahrenheit" : "Celsius"}`}
        >
          °{units === "celsius" ? "F" : "C"}
        </button>

        <button
          className="control-button"
          onClick={toggleLanguage}
          title={`Switch to ${language === "en" ? "German" : "English"}`}
        >
          {language === "en" ? "DE" : "EN"}
        </button>

        <div className="user-menu">
          <span className="user-name">{user?.name}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
