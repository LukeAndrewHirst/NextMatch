'use client'

import { Card, CardFooter, Image } from '@nextui-org/react'
import { Member } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import { calculateAge } from '../lib/util'
import LikeButton from '@/components/LikeButton'

type Props = {
    member: Member
    likeIds: string[]
}

export default function MemberCard({member, likeIds} : Props) {
  const hasLiked = likeIds.includes(member.userId);

  const preventLinkAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }


  return (
    <Card fullWidth as={Link} href={`/members/${member.userId}`} isPressable>
        <Image isZoomed alt={member.name} src={member.image || '/images/user.png'} width={300} className='aspect-square object-cover' />
        <div onClick={preventLinkAction}>
          <div className='absolute top-3 right-3 z-50'>
            <LikeButton targetId={member.userId} hasLiked={hasLiked}/>
          </div>
        </div>
        <CardFooter className='flex justify-start bg-black overflow-hidden absolute bottom-0 z-10 bg-dark-gardient'>
            <div className='flex flex-col text-white'>
                <span className='font-semibold'>{member.name}, {calculateAge(member.dateOfBirth)}</span>
                <span className='text-sm'>{member.city}</span>
            </div>
        </CardFooter>
    </Card>
  )
}
