import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, Key, useEffect, useRef } from "react";
import { deleteMessage, getMessagesByContainer } from "../actions/messageActions";
import { MessageDto } from "../types";
import useMessageStore from "./useMessageStore";

export const useMessages = (intialMessages: MessageDto[], nextCursor?: string) => {
  const cursorRef = useRef(nextCursor);
  const {set, remove, messages, updateUnreadCount, resetMessages} = useMessageStore(state => ({
      set: state.set,
      remove: state.remove,
      messages: state.messages,
      updateUnreadCount: state.updateUnreadCount,
      resetMessages: state.resetMessages
  }));
  const router = useRouter();  
  const searchParams = useSearchParams();
  const isOutbox = searchParams.get('container') === 'outbox';
  const container = searchParams.get('container');
  const [isDeleting, setDeleting] = useState({id: '', loading: false});
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    set(intialMessages);
    cursorRef.current = nextCursor;

    return () => {
        resetMessages();
    }
  }, [intialMessages, resetMessages, set, nextCursor]);

  const loadMore = useCallback(async () => {
    if(cursorRef.current) {
      setLoadingMore(true);
      const {messages, nextCursor} = await getMessagesByContainer(container, cursorRef.current);
      set(messages);
      cursorRef.current = nextCursor;
      setLoadingMore(false)
    }
  }, [container, set])

  const columns = [
    {key: isOutbox ? 'recipientName' : 'senderName', label: isOutbox ? 'Recipient' : 'Sender'},
    {key: 'text', label: 'Message'},
    {key: 'created', label: isOutbox ? 'Date Sent' : 'Date Received'},
    {key: 'actions', label: 'Actions'}
  ]

  const handleRowSelect = (key: Key) => {
    const message = intialMessages.find(m => m.id === key);
    const url = isOutbox ? `/members/${message?.recipientId}` : `/members/${message?.senderId}`;
    router.push(url + '/chat');
  };

  const handleMessageDelete = useCallback(async (message: MessageDto) => {
    setDeleting({id: message.id, loading: true})
    await deleteMessage(message.id, isOutbox);
    remove(message.id);
    if(!message.dateRead && !isOutbox) updateUnreadCount(-1);
    setDeleting({id: '', loading: false});
  }, [isOutbox, remove, updateUnreadCount])

  return {isOutbox, columns, deleteMessage: handleMessageDelete, selectRow: handleRowSelect, isDeleting, messages, loadMore, loadingMore, hasMore: !!cursorRef.current}
}