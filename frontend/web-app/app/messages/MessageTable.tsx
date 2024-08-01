'use client';

import React, {  } from 'react';
import { Button, Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { MessageDto } from '../types';
import MessageTableCell from './MessageTableCell';
import { useMessages } from '../hooks/useMessages';

type Props = {
    intialMessages: MessageDto[],
    nextCursor?: string
}

export default function MessageTable({intialMessages, nextCursor}: Props) {
  const {columns, isOutbox, deleteMessage, selectRow, isDeleting, messages, loadMore, loadingMore, hasMore} = useMessages(intialMessages, nextCursor);

  return (
    <div className='flex flex-col h-[80vh]'>
        <Card>
            <Table aria-label='Table with messages' selectionMode='single' onRowAction={(key) => selectRow(key)} shadow='none' className='flex flex-col gap-3 h-[80vh] overflow-auto'>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key} width={column.key === 'text' ? '50%' : undefined}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={messages} emptyContent='No Messages'>
                    {(item) => (
                        <TableRow key={item.id} className='cursor-pointer'>{(columnKey) => (
                        <TableCell className={`${!item.dateRead && !isOutbox ? 'font-semibold' : ''}`}>
                            <MessageTableCell item={item} columnKey={columnKey as string} isOutbox={isOutbox} deleteMessage={deleteMessage} isDeleting={isDeleting.loading && isDeleting.id === item.id}/>
                        </TableCell>
                        )}</TableRow>
                    )}
                </TableBody>
            </Table>
            <div className='sticky bottom-0 pb-3 mr-3t text-right'>
                <Button color='secondary' isLoading={loadingMore} isDisabled={!hasMore} onClick={loadMore}>{hasMore ? 'Load More Messages': 'No More Messages'}</Button>
            </div>
        </Card>
    </div>
    
  )
}
