'use client';

import { MessageDto } from '@/app/types';
import MessageBox from './MessageBox';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { pusherClient } from '@/app/lib/pusher';
import { formatDateTime } from '@/app/lib/util';
import { Channel } from 'pusher-js';
import useMessageStore from '@/app/hooks/useMessageStore';

type Props = {
    intialMessages: {messages: MessageDto[], readCount: number},
    currentUserId: string,
    chatId: string
}

export default function MessageList({intialMessages, currentUserId, chatId}: Props) {
  const setReadCount = useRef(false);
  const [messages, setMessages] = useState(intialMessages.messages);
  const {updateUnreadCount} = useMessageStore(state => ({
    updateUnreadCount: state.updateUnreadCount
  }));
  useEffect(() => {
    if(!setReadCount.current) {
      updateUnreadCount(-intialMessages.readCount);
      setReadCount.current = true
    }
  }, [intialMessages.readCount, updateUnreadCount])
  
  const channelRef = useRef<Channel | null>(null);
  const handleNewMessage = useCallback((message: MessageDto) => {
    setMessages(prevState => 
        {return [...prevState, message]
    })}, [])
  const handleReadMessages = useCallback((messageIds: string[]) => {
    setMessages(prevState => prevState.map(message => messageIds.includes(message.id)
      ? {...message, dateRead: formatDateTime(new Date())} : message
  ))}, [])
    
  useEffect(() => {
    if(!channelRef.current) {
      channelRef.current = pusherClient.subscribe(chatId);

      channelRef.current.bind('message:new', handleNewMessage);
      channelRef.current.bind('messages:read', handleReadMessages);
    }

    return () => {
      if(channelRef.current && channelRef.current?.subscribed) {
        channelRef.current.unsubscribe();
        channelRef.current.unbind('message:new', handleNewMessage);
        channelRef.current.unbind('messages:read', handleReadMessages);
      }
        
    }
  }, [chatId, handleNewMessage, handleReadMessages]);

  return (
    <div>
      {messages.length === 0 ? 'No messages' : (
        <div>
          {messages.map(message => (
            <MessageBox key={message.id} message={message} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  )
}
