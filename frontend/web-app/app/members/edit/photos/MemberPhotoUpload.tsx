'use client'

import React from 'react';
import ImageUpload from '@/components/ImageUpload';
import { useRouter } from 'next/navigation';
import { CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { addImage } from '@/app/actions/userActions';
import { toast } from 'react-toastify';

export default function MemberPhotoUpload() {
  const router= useRouter();
  
  const onAddImage = async (result: CloudinaryUploadWidgetResults) => {
    if(result.info && typeof result.info === 'object') {
        await addImage(result.info.secure_url, result.info.public_id);
        router.refresh();
    } else {
        toast.error('Unable to upload photo');
    }
  }

  return (
    <div>
      <ImageUpload onUploadImage={onAddImage} />
    </div>
  )
}
