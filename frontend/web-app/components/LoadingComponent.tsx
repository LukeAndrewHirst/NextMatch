
import { Spinner } from '@nextui-org/react'
import React from 'react'

export default function LoadingComponent({label}: {label?: string}) {
  return (
    <div className='fiex flex justify-items-center vertical-center'>
        <Spinner label={label || 'Loading...'} color='secondary' labelColor='secondary' />
    </div>
  )
}
