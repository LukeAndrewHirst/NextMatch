import React from 'react';
import { CardHeader, Divider, CardBody, Image } from '@nextui-org/react'
import { getAuthUserId } from '@/app/actions/authActions';
import { getMemberById, getMemberPhotosById } from '@/app/actions/memberActions';
import StarButton from '@/components/StarButton';
import DeleteButton from '@/components/DeleteButton';
import ImageUpload from '@/components/ImageUpload';
import MemberPhotoUpload from './MemberPhotoUpload';
import MemberImage from '@/components/MemberImage';
import MemberPhotos from '@/components/MemberPhotos';

export default async function PhotosPage() {
  const userId = await getAuthUserId();
  const member = await getMemberById(userId);
  const photos = await getMemberPhotosById(userId);
  return (
    <>
      <CardHeader className='flex flex-row justify-between items-center'>
        Update Profile
        <div className='text-2xl font-semibold text-secondary'>
          <MemberPhotoUpload />
        </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <MemberPhotos photos={photos} editing={true} mainImageUrl={member?.image} />
        </CardBody>
    </>
  )
}
