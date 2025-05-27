import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const UserList = ({ users, selectedUser, onSelectUser }) => (
  <div className="overflow-y-auto h-[calc(100vh-120px)]">
    {users.map((u) => (
      <div
        key={u.id}
        onClick={() => onSelectUser(u)}
        className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedUser?.id === u.id ? 'bg-gray-100' : ''
          }`}
      >
        <div className="flex items-center">
          <span>{u.email}</span>
        </div>
      </div>
    ))}
  </div>
)

const ChatHeader = ({ user, onLogout, currentColor, onColorChange }) => (
  <div className="p-4 border-b">
    <div className="flex items-center justify-between">
      <span className="font-semibold">{user.email}</span>
      <button
        onClick={onLogout}
        className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
      >
        Déconnexion
      </button>
    </div>
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Couleur du prochain message</label>
      <input
        type="color"
        value={currentColor}
        onChange={(e) => onColorChange(e.target.value)}
        className="w-full h-8 mt-1"
      />
    </div>
  </div>
)

const Message = ({ message, isOwnMessage }) => (
  <div
    className={`mb-4 ${isOwnMessage ? 'text-right' : 'text-left'
      }`}
  >
    <div
      className={`inline-block p-3 rounded-lg text-white`}
      style={{
        backgroundColor: message.color
      }}
    >
      {message.content}
    </div>
    <div className="text-xs text-gray-500 mt-1">
      {format(new Date(message.createdAt), 'HH:mm', { locale: fr })}
    </div>
  </div>
)

const MessageList = ({ messages, currentUserId, messagesEndRef }) => (
  <div className="flex-1 overflow-y-auto p-4">
    {messages.map((message) => (
      <Message
        key={message.id}
        message={message}
        isOwnMessage={message.sender.id === currentUserId}
      />
    ))}
    <div ref={messagesEndRef} />
  </div>
)

const MessageForm = ({ newMessage, onMessageChange, onSendMessage, isConnected }) => (
  <form onSubmit={onSendMessage} className="p-4 bg-white shadow">
    <div className="flex">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Écrivez votre message..."
        className="flex-1 p-2 border rounded-l focus:outline-none focus:border-blue-500"
        disabled={!isConnected}
      />
      <button
        type="submit"
        className={`px-4 py-2 text-white rounded-r ${isConnected
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-400 cursor-not-allowed'
          }`}
        disabled={!isConnected}
      >
        Envoyer
      </button>
    </div>
    {!isConnected && (
      <div className="mt-2 text-sm text-red-500">
        Déconnecté du serveur. Tentative de reconnexion...
      </div>
    )}
  </form>
)

function Chat({ user, onLogout, sessionId }) {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [currentColor, setCurrentColor] = useState(user.color || '#3498db')
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem(`token_${sessionId}`)
        const response = await axios.get('http://localhost:3000/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUsers(response.data.filter(u => u.id !== user.id))
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error)
      }
    }

    fetchUsers()
  }, [user.id, sessionId])

  useEffect(() => {
    const token = localStorage.getItem(`token_${sessionId}`)
    if (!token) return

    socketRef.current = io('http://localhost:3000', {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    })

    socketRef.current.on('connect', () => {
      console.log('Connecté au serveur WebSocket')
      setIsConnected(true)
    })

    socketRef.current.on('disconnect', () => {
      console.log('Déconnecté du serveur WebSocket')
      setIsConnected(false)
    })

    socketRef.current.on('connect_error', (error) => {
      console.error('Erreur de connexion WebSocket:', error)
      setIsConnected(false)
    })

    socketRef.current.on('newMessage', (message) => {
      if (
        (message.sender.id === user.id && message.receiver.id === selectedUser?.id) ||
        (message.sender.id === selectedUser?.id && message.receiver.id === user.id)
      ) {
        setMessages((prevMessages) => [...prevMessages, message])
      }
    })

    socketRef.current.on('userConnected', (connectedUser) => {
      if (connectedUser.id === user.id) return

      setUsers((prevUsers) => {
        if (prevUsers.find(u => u.id === connectedUser.id)) {
          return prevUsers
        }
        return [...prevUsers, connectedUser]
      })
    })

    socketRef.current.on('userDisconnected', (disconnectedUser) => {
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== disconnectedUser.id)
      )
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [sessionId, user.id, selectedUser?.id])

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem(`token_${sessionId}`)
          const response = await axios.get(`http://localhost:3000/messages/with/${selectedUser.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setMessages(response.data)
        } catch (error) {
          console.error('Erreur lors de la récupération des messages:', error)
        }
      }

      fetchMessages()
    } else {
      setMessages([])
    }
  }, [selectedUser, sessionId])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser || !isConnected) return

    try {
      socketRef.current.emit('sendMessage', {
        content: newMessage,
        receiverId: selectedUser.id,
        color: currentColor,
      })
      setNewMessage('')
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white shadow-lg">
        <ChatHeader
          user={user}
          onLogout={onLogout}
          currentColor={currentColor}
          onColorChange={setCurrentColor}
        />
        <UserList
          users={users}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
        />
      </div>
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 bg-white shadow">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: selectedUser.color }}
                />
                <span className="font-semibold">{selectedUser.email}</span>
              </div>
            </div>
            <MessageList
              messages={messages}
              currentUserId={user.id}
              messagesEndRef={messagesEndRef}
            />
            <MessageForm
              newMessage={newMessage}
              onMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
              isConnected={isConnected}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Sélectionnez un utilisateur pour commencer à discuter
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat 