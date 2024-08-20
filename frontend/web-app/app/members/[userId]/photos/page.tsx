import React from 'react';
import { getMemberPhotosById } from '@/app/actions/memberActions';
import { CardBody, CardHeader, Divider } from '@nextui-org/react';
import MemberPhotos from '@/components/MemberPhotos';


export default async function PhotosPage({params}: {params: {userId: string}}) {
  const photos = await getMemberPhotosById(params.userId);

  return (
    <>
        <CardHeader className='text-2xl font-semibold text-secondary'>
            Photos
        </CardHeader>
        <Divider />
        <CardBody>
            <MemberPhotos photos={photos} />
        </CardBody>
    </>
  )
}
