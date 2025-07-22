import "./LoadingSpinner.css"

function LoadingSpinner({ size = "medium" }) {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  )
}

export default LoadingSpinner
