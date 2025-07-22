"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("weathernow_token")
    const userData = localStorage.getItem("weathernow_user")

    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication - in real app, validate against backend
      const userData = { email, name: email.split("@")[0] }
      const token = "mock_jwt_token_" + Date.now()

      localStorage.setItem("weathernow_token", token)
      localStorage.setItem("weathernow_user", JSON.stringify(userData))

      setIsAuthenticated(true)
      setUser(userData)

      return { success: true }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  }

  const register = async (email, password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        return { success: false, error: "Passwords do not match" }
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData = { email, name: email.split("@")[0] }
      const token = "mock_jwt_token_" + Date.now()

      localStorage.setItem("weathernow_token", token)
      localStorage.setItem("weathernow_user", JSON.stringify(userData))

      setIsAuthenticated(true)
      setUser(userData)

      return { success: true }
    } catch (error) {
      return { success: false, error: "Registration failed" }
    }
  }

  const logout = () => {
    localStorage.removeItem("weathernow_token")
    localStorage.removeItem("weathernow_user")
    setIsAuthenticated(false)
    setUser(null)
  }

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
