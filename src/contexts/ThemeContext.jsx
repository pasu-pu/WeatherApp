"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light")
  const [units, setUnits] = useState("celsius")
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedTheme = localStorage.getItem("weathernow_theme") || "light"
    const savedUnits = localStorage.getItem("weathernow_units") || "celsius"
    const savedLanguage = localStorage.getItem("weathernow_language") || "en"

    setTheme(savedTheme)
    setUnits(savedUnits)
    setLanguage(savedLanguage)

    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("weathernow_theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  const toggleUnits = () => {
    const newUnits = units === "celsius" ? "fahrenheit" : "celsius"
    setUnits(newUnits)
    localStorage.setItem("weathernow_units", newUnits)
  }

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "de" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("weathernow_language", newLanguage)
  }

  const value = {
    theme,
    units,
    language,
    toggleTheme,
    toggleUnits,
    toggleLanguage,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
