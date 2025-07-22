"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "./AuthContext"
import Toast from "../components/UI/Toast"

const CalendarContext = createContext()

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider")
  }
  return context
}

export function CalendarProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [gapiLoaded, setGapiLoaded] = useState(false)
  const [gisLoaded, setGisLoaded] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [toast, setToast] = useState(null)
  const [tokenClient, setTokenClient] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  // Google API configuration
  const API_KEY = "AIzaSyDVvgKdrlAEGu2w5-Xyq98ezL50fb2mpBE"
  const CLIENT_ID = "606256848817-97fht85uncuqaomdm9ls7lf81m4e057l.apps.googleusercontent.com"
  const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
  const SCOPES = "https://www.googleapis.com/auth/calendar"

  // Check for stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("gapi_token")
    if (storedToken) {
      try {
        const tokenData = JSON.parse(storedToken)
        // Check if token is still valid (not expired)
        const expiryTime = tokenData.expires_at || tokenData.expires_in * 1000 + Date.now()
        if (expiryTime > Date.now()) {
          setAccessToken(tokenData.access_token)
          setIsAuthorized(true)
          console.log("Restored access token from localStorage")
        } else {
          localStorage.removeItem("gapi_token")
          console.log("Stored token expired, removed from localStorage")
        }
      } catch (error) {
        console.error("Error parsing stored token:", error)
        localStorage.removeItem("gapi_token")
      }
    }
  }, [])

  // Load Google API scripts
  useEffect(() => {
    if (!isAuthenticated) return

    let gapiScript = null
    let gisScript = null

    const loadGapiScript = () => {
      if (window.gapi) {
        window.gapi.load("client", initGapiClient)
        return
      }

      gapiScript = document.createElement("script")
      gapiScript.src = "https://apis.google.com/js/api.js"
      gapiScript.async = true
      gapiScript.defer = true
      gapiScript.onload = () => {
        window.gapi.load("client", initGapiClient)
      }
      gapiScript.onerror = () => {
        console.error("Failed to load Google API script")
        setError("Failed to load Google API")
      }
      document.body.appendChild(gapiScript)
    }

    const loadGisScript = () => {
      if (window.google?.accounts?.oauth2) {
        setGisLoaded(true)
        return
      }

      gisScript = document.createElement("script")
      gisScript.src = "https://accounts.google.com/gsi/client"
      gisScript.async = true
      gisScript.defer = true
      gisScript.onload = () => {
        setGisLoaded(true)
      }
      gisScript.onerror = () => {
        console.error("Failed to load Google Identity Services script")
        setError("Failed to load Google Identity Services")
      }
      document.body.appendChild(gisScript)
    }

    loadGapiScript()
    loadGisScript()

    return () => {
      if (gapiScript && document.body.contains(gapiScript)) {
        document.body.removeChild(gapiScript)
      }
      if (gisScript && document.body.contains(gisScript)) {
        document.body.removeChild(gisScript)
      }
    }
  }, [isAuthenticated])

  // Initialize GAPI client
  const initGapiClient = useCallback(async () => {
    try {
      await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
      })
      setGapiLoaded(true)
      console.log("GAPI client initialized successfully")
    } catch (error) {
      console.error("Error initializing GAPI client:", error)
      setError("Failed to initialize Google API client")
    }
  }, [])

  // Set access token when available
  useEffect(() => {
    if (accessToken && window.gapi?.client) {
      window.gapi.client.setToken({ access_token: accessToken })
      console.log("Access token set in GAPI client")
    }
  }, [accessToken, gapiLoaded])

  // Initialize token client when both libraries are loaded
  useEffect(() => {
    if (!gapiLoaded || !gisLoaded) return

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          console.log("Token response received:", tokenResponse)
          if (tokenResponse && tokenResponse.access_token) {
            const expiryTime = Date.now() + tokenResponse.expires_in * 1000
            const tokenData = {
              ...tokenResponse,
              expires_at: expiryTime,
            }

            localStorage.setItem("gapi_token", JSON.stringify(tokenData))
            setAccessToken(tokenResponse.access_token)
            setIsAuthorized(true)
            setToast({ type: "success", message: "Successfully connected to Google Calendar" })

            // Set token in GAPI client immediately
            if (window.gapi?.client) {
              window.gapi.client.setToken({ access_token: tokenResponse.access_token })
            }
          }
        },
        error_callback: (error) => {
          console.error("Token client error:", error)
          setError("Failed to authorize Google Calendar")
          setToast({ type: "error", message: "Failed to connect to Google Calendar" })
        },
      })

      setTokenClient(client)
      setIsInitialized(true)
      console.log("Token client initialized successfully")
    } catch (error) {
      console.error("Error initializing token client:", error)
      setError("Failed to initialize Google authorization")
    }
  }, [gapiLoaded, gisLoaded])

  const authorizeCalendar = useCallback(async () => {
    if (!tokenClient) {
      setToast({ type: "error", message: "Google API not initialized yet. Please try again." })
      return false
    }

    try {
      tokenClient.requestAccessToken({ prompt: "consent" })
      return true
    } catch (error) {
      console.error("Authorization error:", error)
      setToast({ type: "error", message: "Failed to authorize Google Calendar" })
      return false
    }
  }, [tokenClient])

  const signOutFromCalendar = useCallback(async () => {
    try {
      if (accessToken && window.google?.accounts?.oauth2) {
        window.google.accounts.oauth2.revoke(accessToken, () => {
          console.log("Token revoked successfully")
        })
      }

      localStorage.removeItem("gapi_token")
      setAccessToken(null)
      setIsAuthorized(false)
      setEvents([])

      if (window.gapi?.client) {
        window.gapi.client.setToken(null)
      }

      setToast({ type: "success", message: "Disconnected from Google Calendar" })
      return true
    } catch (error) {
      console.error("Sign out error:", error)
      setToast({ type: "error", message: "Failed to disconnect from Google Calendar" })
      return false
    }
  }, [accessToken])

  const fetchEvents = useCallback(
    async (timeMin, timeMax) => {
      if (!gapiLoaded || !isAuthorized || !accessToken) {
        console.log(
          "Cannot fetch events: gapiLoaded:",
          gapiLoaded,
          "isAuthorized:",
          isAuthorized,
          "accessToken:",
          !!accessToken,
        )
        return []
      }

      try {
        setIsLoading(true)
        setError(null)

        // Ensure token is set
        if (window.gapi?.client) {
          window.gapi.client.setToken({ access_token: accessToken })
        }

        const response = await window.gapi.client.calendar.events.list({
          calendarId: "primary",
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          showDeleted: false,
          singleEvents: true,
          orderBy: "startTime",
          maxResults: 100,
        })

        const events = response.result.items || []
        console.log(`Fetched ${events.length} events from Google Calendar`)
        return events
      } catch (error) {
        console.error("Error fetching events:", error)

        // If unauthorized, try to refresh token
        if (error.status === 401) {
          console.log("Unauthorized, clearing stored token")
          localStorage.removeItem("gapi_token")
          setAccessToken(null)
          setIsAuthorized(false)
        }

        setError("Failed to fetch calendar events")
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [gapiLoaded, isAuthorized, accessToken],
  )

  const fetchEventsForDate = useCallback(
    async (date) => {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      return fetchEvents(startOfDay, endOfDay)
    },
    [fetchEvents],
  )

  const fetchEventsForMonth = useCallback(
    async (date) => {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      lastDay.setHours(23, 59, 59, 999)

      return fetchEvents(firstDay, lastDay)
    },
    [fetchEvents],
  )

  const fetchTodayEvents = useCallback(async () => {
    const today = new Date()
    return fetchEventsForDate(today)
  }, [fetchEventsForDate])

  const addEvent = useCallback(
    async (event) => {
      console.log("Adding event:", event)

      if (!gapiLoaded || !isAuthorized || !accessToken) {
        setToast({ type: "error", message: "Please connect your Google Calendar first" })
        return null
      }

      try {
        setIsLoading(true)
        setError(null)

        // Ensure token is set
        if (window.gapi?.client) {
          window.gapi.client.setToken({ access_token: accessToken })
        }

        const response = await window.gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
        })

        console.log("Event added successfully:", response.result)
        setToast({ type: "success", message: "Event added to your calendar!" })

        // Refresh events after adding
        setTimeout(async () => {
          try {
            if (event.start.dateTime) {
              const eventDate = new Date(event.start.dateTime)
              await fetchEventsForDate(eventDate)
            }
          } catch (error) {
            console.error("Error refreshing events after add:", error)
          }
        }, 1000) // Small delay to allow Google Calendar to process

        return response.result
      } catch (error) {
        console.error("Error adding event:", error)
        setToast({ type: "error", message: `Failed to add event: ${error.message || "Unknown error"}` })
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [gapiLoaded, isAuthorized, accessToken, fetchEventsForDate],
  )

  const value = {
    events,
    isLoading,
    error,
    isAuthorized,
    isInitialized,
    authorizeCalendar,
    signOutFromCalendar,
    fetchEventsForDate,
    fetchEventsForMonth,
    fetchTodayEvents,
    addEvent,
    gapiLoaded,
    gisLoaded,
  }

  return (
    <CalendarContext.Provider value={value}>
      {children}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </CalendarContext.Provider>
  )
}
