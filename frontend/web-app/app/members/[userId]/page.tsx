import { getMemberById } from '@/app/actions/memberActions';
import CardInnerWrapper from '@/components/CardInnerWrapper';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function MemberDetailsPage({params}: {params: {userId: string}}) {
  const member = await getMemberById(params.userId);

  if(!member) return notFound();

  return (
    <CardInnerWrapper header='Profile' body={<div>{member.description}</div>} />
  )
}
