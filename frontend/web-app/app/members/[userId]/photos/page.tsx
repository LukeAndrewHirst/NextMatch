import { getMemberPhotosById } from '@/app/actions/memberActions';
import CardInnerWrapper from '@/components/CardInnerWrapper';
import { Image } from '@nextui-org/react';
import React from 'react';

export default async function PhotosPage({params}: {params: {userId: string}}) {
  const photos = await getMemberPhotosById(params.userId);

  return (
    <CardInnerWrapper header='Photos' body={<div>{photos && photos.map(photo => (<div key={photo.id}><Image width={300} height={300} src={photo.url} alt={photo.memberId} className='object-cover aspect-square' /></div>))}</div>} />
  )
}
