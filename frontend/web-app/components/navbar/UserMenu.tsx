'use client'

import React from 'react';
import { signOutUser } from '@/app/actions/authActions';
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react';
import Link from 'next/link';
import { transformImageUrl } from '@/app/lib/util';

type Props = {
    userInfo: {name: string | null; image: string | null;} | null
}

export default function UserMenu({userInfo}: Props) {
  return (
    <Dropdown placement='bottom-end'>
        <DropdownTrigger>
            <Avatar isBordered as='button' className='transition-transform' color='secondary' name={userInfo?.name || 'user avatar'} size='sm' src={transformImageUrl(userInfo?.image) || 'images/user.png'} />
        </DropdownTrigger>
        <DropdownMenu variant='flat' aria-label='User actions menu'>
            <DropdownSection showDivider>
                <DropdownItem isReadOnly as='span' className='h-14 flex flex-row' aria-label='username'>{userInfo?.name}</DropdownItem>
                <DropdownItem as={Link} href='/members/edit'>Edit Profile</DropdownItem>
                <DropdownItem color='danger' onClick={async() => signOutUser()}>Logout</DropdownItem>
            </DropdownSection>
        </DropdownMenu>
    </Dropdown>
  )
}
