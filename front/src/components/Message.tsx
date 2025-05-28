import React from 'react';

interface MessageProps {
  id: number;
  content: string;
  color: string;
  username: string;
  createdAt: string;
}

export const Message: React.FC<MessageProps> = ({ content, color, username }) => {
  return (
    <div className="message" style={{ color }}>
      <span className="username">{username}: </span>
      <span className="content">{content}</span>
    </div>
  );
}; 