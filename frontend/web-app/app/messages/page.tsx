import React, { Key } from 'react'
import MessageSideBar from './MessageSideBar';
import { getMessagesByContainer } from '../actions/messageActions';
import MessageTable from './MessageTable';

export default async function MessagesPage({searchParams}: {searchParams: {container: string}}) {
  const messages = await getMessagesByContainer(searchParams.container);
  
  return (
    <div className='grid grid-cols-12 gap-5 h-[80vh] mt-10'>
      <div className='col-span-2'>
        <MessageSideBar />
      </div>
      <div className='col-span-10'>
        <MessageTable intialMessages={messages} />
      </div>
    </div>
  )
}
