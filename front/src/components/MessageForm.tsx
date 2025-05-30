import React, { useState, useEffect } from 'react';

interface MessageFormProps {
  onSendMessage: (content: string, color: string) => void;
}

export const MessageForm: React.FC<MessageFormProps> = ({ onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState('#770044');

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    onSendMessage(newMessage, selectedColor);
    setNewMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <div className="color-picker-container">
        <input
          type="color"
          value={selectedColor}
          onChange={handleColorChange}
          className="color-picker"
        />
        <span style={{ color: selectedColor }}>Couleur choisie</span>
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Ecrivez votre message..."
        className="message-input"
      />
      <button type="submit" className="send-button">Envoyer</button>
    </form>
  );
}; 