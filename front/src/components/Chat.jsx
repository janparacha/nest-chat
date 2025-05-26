import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#3498db');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const socketRef = useRef();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    
    if (!token) {
      navigate('/login');
      return;
    }

    console.log('Connexion au serveur avec token:', token);
    console.log('Email de l\'utilisateur:', email);
    
    // Récupérer les informations de l'utilisateur actuel
    fetch('http://localhost:3000/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Informations utilisateur:', data);
      setCurrentUser(data);
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
    });
    
    socketRef.current = io('http://localhost:3000', {
      auth: { token },
      withCredentials: true,  // Ajout de cette option pour les cookies
      transports: ['websocket']  // Forcer l'utilisation de WebSocket
    });

    socketRef.current.on('connect', () => {
      console.log('Connecté au serveur avec ID:', socketRef.current.id);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Erreur de connexion:', error);
      console.error('Détails de l\'erreur:', error.message);
    });

    socketRef.current.on('userConnected', (user) => {
      console.log('Utilisateur connecté:', user);
      setUsers((prevUsers) => {
        // Éviter les doublons
        if (prevUsers.some(u => u.id === user.id)) {
          return prevUsers;
        }
        return [...prevUsers, user];
      });
    });

    socketRef.current.on('userDisconnected', (user) => {
      console.log('Utilisateur déconnecté:', user);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
    });

    socketRef.current.on('newMessage', (message) => {
      console.log('Nouveau message reçu:', message);
      setMessages((prevMessages) => {
        console.log('Messages précédents:', prevMessages);
        const newMessages = [...prevMessages, message];
        console.log('Nouveaux messages:', newMessages);
        return newMessages;
      });
    });

    return () => {
      if (socketRef.current) {
        console.log('Déconnexion du socket');
        socketRef.current.disconnect();
      }
    };
  }, [navigate]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socketRef.current) {
      console.log('Envoi du message:', message);
      socketRef.current.emit('sendMessage', {
        content: message,
        receiverId: 'general', // Pour le chat général
      });
      setMessage('');
    }
  };

  const handleColorChange = async (color) => {
    try {
      const response = await fetch('http://localhost:3000/user/profile/color', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ color }),
      });

      if (response.ok) {
        setSelectedColor(color);
        setShowColorPicker(false);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la couleur:', error);
    }
  };

  const handleTyping = () => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { isTyping: true });
      setTimeout(() => {
        socketRef.current.emit('typing', { isTyping: false });
      }, 2000);
    }
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('userTyping', ({ userId, isTyping }) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (isTyping) {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      });
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-4">Utilisateurs en ligne</h2>
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 transition-colors duration-200"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: user.color }}
                />
                <span className="truncate">{user.email}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t mt-auto">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Changer ma couleur
          </button>
          {showColorPicker && (
            <div className="mt-2 p-2 bg-white rounded-lg shadow-lg">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              Aucun message. Commencez à discuter !
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender.id === currentUser?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className="max-w-xs p-3 rounded-lg shadow-md"
                  style={{
                    backgroundColor: msg.sender.color,
                    color: 'white',
                  }}
                >
                  <div className="text-sm font-semibold">{msg.sender.email}</div>
                  <div className="mt-1">{msg.content}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {format(new Date(msg.createdAt || Date.now()), 'HH:mm', { locale: fr })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {typingUsers.size > 0 && (
          <div className="px-4 py-2 text-sm text-gray-500 italic">
            {Array.from(typingUsers).length} utilisateur(s) en train d'écrire...
          </div>
        )}

        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleTyping}
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200"
              placeholder="Écrivez votre message..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat; 