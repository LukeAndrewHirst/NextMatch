'use client'

import React from 'react';
import CardWrapper from '@/components/CardWrapper';
import { FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function RegisterSuccessPage() {
  const router = useRouter();  
  return (
    <CardWrapper headerText='You are now registered to use NextMatch' action={() => router.push('/auth/login')} actionLabel='Proceed to login' headerIcon={FaCheckCircle} />
  )
}
