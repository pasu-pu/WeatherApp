function EventsList({ date }) {
  // Mock events data
  const events = [
    { time: "9:00 AM", title: "Team Meeting", type: "work" },
    { time: "2:00 PM", title: "Free Time", type: "free" },
    { time: "5:00 PM", title: "Dinner Plans", type: "personal" },
  ]

  const getEventIcon = (type) => {
    switch (type) {
      case "work":
        return "💼"
      case "personal":
        return "👥"
      case "free":
        return "🆓"
      default:
        return "📅"
    }
  }

  return (
    <div style={{ marginBottom: "24px" }}>
      <h3 style={{ marginBottom: "16px", color: "var(--text-primary)" }}>📅 Schedule</h3>
      <div>
        {events.map((event, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              background: "var(--bg-tertiary)",
              borderRadius: "8px",
              marginBottom: "8px",
              color: "var(--text-primary)",
            }}
          >
            <span>{getEventIcon(event.type)}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "500" }}>{event.title}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{event.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventsList
