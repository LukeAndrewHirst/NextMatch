import { Spinner } from '@nextui-org/react'
import React from 'react'

export default function Loading() {
  return (
    <div className='flex justify-center items-center vertical-center'>
        <Spinner label='loading...' color='secondary' labelColor='secondary' />
    </div>
  )
}
