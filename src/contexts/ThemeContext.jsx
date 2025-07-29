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

// Translation dictionary
const translations = {
  en: {
    welcome: "Welcome to WeatherNow",
    planActivities: "Plan your activities with weather and calendar integration",
    todaysSchedule: "Today's Schedule",
    yourSchedule: "Your Schedule",
    weatherForecast: "Weather Forecast",
    fiveDayForecast: "Five‑Day Forecast",
    detailedPredictions: "Detailed predictions for the next five days",
    suggestedActivities: "Suggested Activities",
    connectCalendar: "Connect Calendar",
    addToCalendar: "Add to Calendar",
    noEvents: "No events scheduled",
    loading: "Loading...",
    freeTime: "free time",
    allDay: "All day",
    visitCafe: "Visit a cozy café",
    watchMovie: "Watch a movie",
    readLibrary: "Read at the library",
    visitMuseum: "Visit a museum",
    goCycling: "Go cycling",
    outdoorJogging: "Outdoor jogging",
    walkPark: "Walk in the park",
    beachActivities: "Beach activities",
    shoppingMall: "Shopping mall visit",
    indoorActivities: "Indoor activities",
    cafeHopping: "Café hopping",
    gamingSession: "Gaming session",
    yourProfile: "Your Profile",
    profileTabDescription: "Manage your account and preferences",
    accountInformation: "Account Information",
    name: "Name",
    email: "Email",
    memSince: "Member Since",
    connServices: "Connected Services",
    googleCalendar: "Google Calendar",
    preferences: "Your Preferences",
    theme: "Theme",
    tempUnit: "Temperature Units",
    language: "Language",
    recSearch: "Recent Searches",
    noRecSearch: "No recent Searches",
    activitySuggestions: "Activity Suggestions",
    toCheckSchedule: " to see your Schedule",
    clickToAdd: "Click to add",
    searchForCity: "Search for a city...",
  },
  de: {
    welcome: "Willkommen bei WeatherNow",
    planActivities: "Planen Sie Ihre Aktivitäten mit Wetter- und Kalenderintegration",
    todaysSchedule: "Heutiger Zeitplan",
    yourSchedule: "Dein Zeitplan",
    weatherForecast: "Wettervorhersage",
    fiveDayForecast: "5‑Tage‑Vorhersage",
    detailedPredictions: "Detaillierte Vorhersagen für die nächsten fünf Tage",
    suggestedActivities: "Vorgeschlagene Aktivitäten",
    connectCalendar: "Kalender verbinden",
    addToCalendar: "Zum Kalender hinzufügen",
    noEvents: "Keine Termine geplant",
    loading: "Laden...",
    freeTime: "freie Zeit",
    allDay: "Ganztägig",
    visitCafe: "Ein gemütliches Café besuchen",
    watchMovie: "Einen Film schauen",
    readLibrary: "In der Bibliothek lesen",
    visitMuseum: "Ein Museum besuchen",
    goCycling: "Radfahren gehen",
    outdoorJogging: "Joggen im Freien",
    walkPark: "Im Park spazieren",
    beachActivities: "Strandaktivitäten",
    shoppingMall: "Einkaufszentrum besuchen",
    indoorActivities: "Indoor-Aktivitäten",
    cafeHopping: "Café-Hopping",
    gamingSession: "Gaming-Session",
    yourProfile: "Dein Profil",
    profileTabDescription: "Verwalte deinen Account und deine Einstellungen",
    accountInformation: "Account Information",
    name: "Name",
    email: "Email",
    memSince: "Mitglied seit",
    connServices: "Verbundene Services",
    googleCalendar: "Google Kalender",
    preferences: "Deine Einstellungen",
    theme: "Theme",
    tempUnit: "Temperatureinheit",
    language: "Sprache",
    recSearch: "Kürzliche Suchanfragen",
    noRecSearch: "Kein Suchverlauf",
    activitySuggestions: "Vorschläge für Freizeitaktivitäten",
    toCheckSchedule: " um deine Termine zu sehen",
    clickToAdd: "Klicken zum hinzufügen",
    searchForCity: "SSuche eine Stadt...",
  },
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

  const translate = (key) => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  return (
    <ThemeContext.Provider
      value={{ theme, units, language, toggleTheme, toggleUnits, toggleLanguage, translate }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
