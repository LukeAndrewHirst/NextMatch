import React from 'react'
import { getUnapprovedPhotos } from '@/app/actions/adminActions';
import MemberPhotos from '@/components/MemberPhotos';
import { Divider } from '@nextui-org/react';

export default async function PhotoModerationPage() {
  const photos = await getUnapprovedPhotos();
  return (
    <div className='flex flex-col mt-10 gap-3'>
      <h3 className='text-2xl'>Photos Awating Moderation</h3>
      <Divider />
      <MemberPhotos photos={photos} />
    </div>
  )
}
