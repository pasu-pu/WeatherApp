"use client"

import { useState, useRef, useEffect } from "react"
import { useWeather } from "../../contexts/WeatherContext"
import "./SearchBar.css"

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const { recentSearches } = useWeather()
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const filteredSearches = recentSearches.filter((city) => city.toLowerCase().includes(query.toLowerCase()))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setQuery("")
      setShowDropdown(false)
    }
  }

  const handleRecentClick = (city) => {
    setQuery(city)
    onSearch(city)
    setShowDropdown(false)
  }

  const handleInputFocus = () => {
    if (recentSearches.length > 0) {
      setShowDropdown(true)
    }
  }

  const handleInputBlur = (e) => {
    // Delay hiding dropdown to allow clicks on dropdown items
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setShowDropdown(false)
      }
    }, 150)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search for a city..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍
        </button>
      </form>

      {showDropdown && filteredSearches.length > 0 && (
        <div ref={dropdownRef} className="search-dropdown">
          <div className="dropdown-header">Recent searches</div>
          {filteredSearches.map((city, index) => (
            <button key={index} className="dropdown-item" onClick={() => handleRecentClick(city)}>
              📍 {city}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
