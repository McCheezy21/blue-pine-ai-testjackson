import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function Dashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to facility page by default
    navigate("/dashboard/facility")
  }, [navigate])

  return null
}