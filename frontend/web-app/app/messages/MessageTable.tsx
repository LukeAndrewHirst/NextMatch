'use client';

import React, { Key, useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Avatar, Button, Card, getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { MessageDto } from '../types';
import { AiFillDelete } from 'react-icons/ai';
import { deleteMessage } from '../actions/messageActions';
import { truncateString } from '../lib/util';

type Props = {
    messages: MessageDto[];
}

export default function MessageTable({messages}: Props) {
  const router = useRouter();  
  const searchParams = useSearchParams();
  const isOutbox = searchParams.get('container') === 'outbox';
  const [isDeleting, setDeleting] = useState({id: '', loading: false});

  const columns = [
    {key: isOutbox ? 'recipientName' : 'senderName', label: isOutbox ? 'Recipient' : 'Sender'},
    {key: 'text', label: 'Message'},
    {key: 'created', label: isOutbox ? 'Date Sent' : 'Date Received'},
    {key: 'actions', label: 'Actions'}
  ]

  const handleRowSelect = (key: Key) => {
    const message = messages.find(m => m.id === key);
    const url = isOutbox ? `/members/${message?.recipientId}` : `/members/${message?.senderId}`;
    router.push(url + '/chat');
  };

  const handleMessageDelete = useCallback(async (message: MessageDto) => {
    setDeleting({id: message.id, loading: true})
    await deleteMessage(message.id, isOutbox);
    router.refresh();
    setDeleting({id: '', loading: false});
  }, [isOutbox, router])

  const renderCell = useCallback((item: MessageDto, columnKey: keyof MessageDto) => {
    const cellValue = item[columnKey]

    switch (columnKey) {
      case 'recipientName':
      case 'senderName':
        return (
          <div className='flex items-cemter gap-2 cursor-pointer'>
            <Avatar alt='member avatar' src={(isOutbox ? item.recipientImage : item.senderImage) || '/images/user.png'}  />
            <span>{cellValue}</span>
          </div>
        )  
      case 'text':
        return (
          <div >{truncateString(cellValue)}</div>
        )
      case 'created':
        return cellValue    
      default:
        return (
          <Button isIconOnly variant='light' onClick={() => handleMessageDelete(item)} isLoading={isDeleting.id === item.id && isDeleting.loading}><AiFillDelete size={24} className='text-danger' /></Button>
        )
        break;
    }
  }, [isOutbox, isDeleting.id, isDeleting.loading, handleMessageDelete])

  return (
    <Card className='flex flex-col gap-3 h-[80vh] overflow-auto'>
        <Table aria-label='Table with messages' selectionMode='single' onRowAction={(key) => handleRowSelect(key)} shadow='none'>
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key} width={column.key === 'text' ? '50%' : undefined}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={messages} emptyContent='No Messages'>
                {(item) => (
                    <TableRow key={item.id} className='cursor-pointer'>{(columnKey) => (
                    <TableCell className={`${!item.dateRead && !isOutbox ? 'font-semibold' : ''}`}>
                        {renderCell(item, columnKey as keyof MessageDto)}
                    </TableCell>
                    )}</TableRow>
                )}
            </TableBody>
        </Table>
    </Card>
  )
}
