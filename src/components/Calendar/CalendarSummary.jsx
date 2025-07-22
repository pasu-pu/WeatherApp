function CalendarSummary() {
  return (
    <div>
      <h3 style={{ marginBottom: "16px", color: "var(--text-primary)" }}>📅 Today's Schedule</h3>
      <div style={{ color: "var(--text-secondary)" }}>
        <p style={{ marginBottom: "8px" }}>• 9:00 AM - Team Meeting</p>
        <p style={{ marginBottom: "8px" }}>• 2:00 PM - Free Time (3 hours)</p>
        <p style={{ marginBottom: "8px" }}>• 5:00 PM - Dinner with friends</p>
        <p style={{ marginTop: "16px", fontStyle: "italic" }}>You have 3 hours of free time this afternoon!</p>
      </div>
    </div>
  )
}

export default CalendarSummary
