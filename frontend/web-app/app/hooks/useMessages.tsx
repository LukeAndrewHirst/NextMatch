import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, Key, useEffect } from "react";
import { deleteMessage } from "../actions/messageActions";
import { MessageDto } from "../types";
import useMessageStore from "./useMessageStore";

export const useMessages = (intialMessages: MessageDto[]) => {
    const {set, remove, messages, updateUnreadCount} = useMessageStore(state => ({
        set: state.set,
        remove: state.remove,
        messages: state.messages,
        updateUnreadCount: state.updateUnreadCount
    }));
  const router = useRouter();  
  const searchParams = useSearchParams();
  const isOutbox = searchParams.get('container') === 'outbox';
  const [isDeleting, setDeleting] = useState({id: '', loading: false});

  useEffect(() => {
    set(intialMessages)

    return () => {
        set([])
    }
  }, [intialMessages, set])

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

  return {isOutbox, columns, deleteMessage: handleMessageDelete, selectRow: handleRowSelect, isDeleting, messages}
}