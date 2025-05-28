import React, { useState, useEffect } from 'react';

interface MessageFormProps {
  onSendMessage: (content: string, color: string) => Promise<void>;
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

    await onSendMessage(newMessage, selectedColor);
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
        <span style={{ color: selectedColor }}>Selected Color</span>
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        className="message-input"
      />
      <button type="submit" className="send-button">Send</button>
    </form>
  );
}; 