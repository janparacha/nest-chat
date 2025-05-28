import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { Chat } from './components/Chat'
import './App.css'

interface Message {
  id: number
  content: string
  color: string
  username: string
  createdAt: string
}

function App() {
  const [socket, setSocket] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')

  const connectSocket = () => {
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket)
    newSocket.on('message', (message: Message) => {
      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    })
    newSocket.emitWithAck('getMessages').then((msgs: Message[]) => {
      const uniqueMessages = msgs.filter((msg, index, self) =>
        index === self.findIndex((m) => m.id === msg.id)
      );
      setMessages(uniqueMessages);
    });
  }

  useEffect(() => {
    if (!socket) {
      connectSocket()
    }
  }, [])

  const handleRegister = async (username: string, email: string, password: string) => {
    if (!socket) return
    try {
      const response = await socket.emitWithAck('register', { username, email, password })
      if (response.success) {
        setUsername(username)
        setIsLoggedIn(true)
      } else {
        setError(response.error)
      }
    } catch (error) {
      setError('Registration failed')
    }
  }

  const handleLogin = async (email: string, password: string) => {
    if (!socket) return
    try {
      const response = await socket.emitWithAck('login', { email, password })
      if (response.success) {
        setUsername(response.username)
        setIsLoggedIn(true)
      } else {
        setError(response.error)
      }
    } catch (error) {
      setError('Login failed')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setMessages([])
    if (socket) {
      socket.close()
      setSocket(null)
    }
  }

  const handleSendMessage = async (content: string, color: string) => {
    if (!socket) return
    const response = await socket.emitWithAck('message', {
      content,
      color,
    })
    if (!response.success) {
      setError('Failed to send message')
    }
  }

  if (!isLoggedIn) {
    return isRegistering ? (
      <Register
        onRegister={handleRegister}
        onSwitchToLogin={() => setIsRegistering(false)}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setIsRegistering(true)}
      />
    )
  }

  return (
    <Chat
      messages={messages}
      onSendMessage={handleSendMessage}
      username={username}
      onLogout={handleLogout}
    />
  )
}

export default App
