'use client';

import React, {  } from 'react';
import { Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { MessageDto } from '../types';
import MessageTableCell from './MessageTableCell';
import { useMessages } from '../hooks/useMessages';

type Props = {
    intialMessages: MessageDto[];
}

export default function MessageTable({intialMessages}: Props) {
  const {columns, isOutbox, deleteMessage, selectRow, isDeleting, messages} = useMessages(intialMessages);

  return (
    <Card className='flex flex-col gap-3 h-[80vh] overflow-auto'>
        <Table aria-label='Table with messages' selectionMode='single' onRowAction={(key) => selectRow(key)} shadow='none'>
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
    </Card>
  )
}
