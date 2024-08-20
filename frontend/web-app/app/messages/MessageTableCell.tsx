
import React from 'react';
import { MessageDto } from '../types';
import PresenceAvatar from '@/components/PresenceAvatar';
import { truncateString } from '../lib/util';
import { Button, ButtonProps, useDisclosure } from '@nextui-org/react';
import { AiFillDelete } from 'react-icons/ai';
import AppModal from '@/components/AppModal';

type Props = {
    item: MessageDto,
    columnKey: string,
    isOutbox: boolean,
    deleteMessage: (message: MessageDto) => void,
    isDeleting: boolean
}

export default function MessableTableCell({item, columnKey, isOutbox, deleteMessage, isDeleting}: Props) {
    const cellValue = item[columnKey as keyof MessageDto]
    const { isOpen, onOpen, onClose } = useDisclosure();
    const onConfirmDeleteMessage = () => {
      deleteMessage(item);
    }
    const footerButtons: ButtonProps[] = [{color: 'default', onClick: onClose, children: 'Cancel'}, {color: 'secondary', onClick: onConfirmDeleteMessage, children: 'Confirm'}];
    

    switch (columnKey) {
      case 'recipientName':
      case 'senderName':
        return (
          <div className='flex items-cemter gap-2 cursor-pointer'>
            <PresenceAvatar userId={isOutbox ? item.recipientId : item.senderId} src={isOutbox ? item.recipientImage : item.senderImage}/>
            <span>{cellValue}</span>
          </div>
        )  
      case 'text':
        return (
          <div >{truncateString(cellValue)}</div>
        )
      case 'created':
        return <div>{cellValue}</div>    
      default:
        return (
          <>
            <Button isIconOnly variant='light' onClick={() => onOpen()} isLoading={isDeleting}><AiFillDelete size={24} className='text-danger' /></Button>
            <AppModal isOpen={isOpen} onClose={onClose} header='Delete Message' body={<div>Are you sure you mant to delete this message?</div>} footerButtons={footerButtons} />
          </>
          
        )
    }
}
