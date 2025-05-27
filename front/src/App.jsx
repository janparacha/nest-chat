import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Chat from './components/Chat'
import axios from 'axios'

const generateSessionId = () => {
    const existingSessions = Object.keys(localStorage)
    .filter(key => key.startsWith('session_'))
    .map(key => parseInt(key.split('_')[1]))
    .filter(id => !isNaN(id))

    let newId = 1
  while (existingSessions.includes(newId)) {
    newId++
  }
  return newId
}

const getSessionId = () => {
  const sessionId = localStorage.getItem('current_session')
  if (sessionId) {
    return parseInt(sessionId)
  }
  const newSessionId = generateSessionId()
  localStorage.setItem('current_session', newSessionId.toString())
  return newSessionId
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId] = useState(getSessionId)

    useEffect(() => {
    const token = localStorage.getItem(`token_${sessionId}`)
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      validateToken()
    } else {
      setIsLoading(false)
    }
  }, [sessionId])

    const validateToken = async () => {
    try {
      const token = localStorage.getItem(`token_${sessionId}`)
      const userData = localStorage.getItem(`user_${sessionId}`)

      if (!token || !userData) {
        console.log('Pas de token ou de données utilisateur trouvés')
        setIsAuthenticated(false)
        setUser(null)
        setIsLoading(false)
        return
      }

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      console.log('Validation du token...')
      const response = await axios.get('http://localhost:3000/users/me')
      console.log('Réponse de /users/me:', response.data)

      if (response.data) {
        setIsAuthenticated(true)
        setUser(response.data)
                localStorage.setItem(`user_${sessionId}`, JSON.stringify(response.data))
        console.log('Utilisateur authentifié:', response.data)
      } else {
        throw new Error('Invalid response from /users/me')
      }
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error)
      if (error.response && error.response.status === 401) {
        localStorage.removeItem(`token_${sessionId}`)
        localStorage.removeItem(`user_${sessionId}`)
        delete axios.defaults.headers.common['Authorization']
      }
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuth = (userData, token) => {
    localStorage.setItem(`token_${sessionId}`, token)
    localStorage.setItem(`user_${sessionId}`, JSON.stringify(userData))
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem(`token_${sessionId}`)
    localStorage.removeItem(`user_${sessionId}`)
    delete axios.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
    setUser(null)
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/chat" replace />
            ) : (
              <Login onAuth={handleAuth} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/chat" replace />
            ) : (
              <Register onAuth={handleAuth} />
            )
          }
        />
        <Route
          path="/chat"
          element={
            isAuthenticated ? (
              <Chat user={user} onLogout={handleLogout} sessionId={sessionId} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App 