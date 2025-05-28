import React from 'react';
import { Message } from './Message';

interface MessageType {
  id: number;
  content: string;
  color: string;
  username: string;
  createdAt: string;
}

interface MessageListProps {
  messages: MessageType[];
}

export function MessageList({ messages }: MessageListProps) {
  const uniqueMessages = messages.filter((msg, index, self) =>
    index === self.findIndex((m) => m.id === msg.id)
  );

  return (
    <div className="messages">
      {uniqueMessages.map((message) => (
        <Message
          key={message.id}
          id={message.id}
          content={message.content}
          color={message.color}
          username={message.username}
          createdAt={message.createdAt}
        />
      ))}
    </div>
  );
} 