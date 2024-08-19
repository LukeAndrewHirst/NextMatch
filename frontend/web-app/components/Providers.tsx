'use client';

import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
import { getUnreadMesageCount } from '@/app/actions/messageActions';
import useMessageStore from '@/app/hooks/useMessageStore';
import { useNotificationChannel } from '@/app/hooks/useNotificationChannel';
import { usePresenceChannel } from '@/app/hooks/usePresenceChannel';
import { NextUIProvider } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SessionProvider } from 'next-auth/react';

export default function Providers({children, userId, profileComplete}: {children: ReactNode, userId: string | null, profileComplete: boolean}) {
  const isUnreadCountSet = useRef(false);
  const {updateUnreadCount} = useMessageStore(state => ({updateUnreadCount: state.updateUnreadCount}));
  const setUnreadCount = useCallback((amount: number) => {updateUnreadCount(amount);}, [updateUnreadCount])

  useEffect(() => {
    if(!isUnreadCountSet.current && userId) {
      getUnreadMesageCount().then(count => {setUnreadCount(count);});
      isUnreadCountSet.current = true;
    }
  }, [setUnreadCount, userId])

  usePresenceChannel(userId, profileComplete);
  useNotificationChannel(userId, profileComplete);
  return (
    <SessionProvider>
      <NextUIProvider>
        <ToastContainer position='bottom-right' hideProgressBar className='z-50' />
        {children}
      </NextUIProvider>
    </SessionProvider>
  )
}
