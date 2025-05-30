import React from 'react';
import { MessageList } from './MessageList';
import { MessageForm } from './MessageForm';

interface MessageType {
  id: number;
  content: string;
  color: string;
  username: string;
  createdAt: string;
}

interface ChatProps {
  messages: MessageType[];
  onSendMessage: (content: string, color: string) => void;
  username: string;
  onLogout: () => void;
}

export const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, username, onLogout }) => {
  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="username">Salut {username}!</span>
        <button onClick={onLogout} className="logout-button">
          Déconnexion
        </button>
      </div>
      <MessageList messages={messages} />
      <MessageForm onSendMessage={onSendMessage} />
    </div>
  );
}; 