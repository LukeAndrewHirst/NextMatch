
import { Spinner } from '@nextui-org/react'
import React from 'react'

export default function LoadingComponent({label}: {label?: string}) {
  return (
    <div className='fiex inset-0 flex justify-items-center'>
        <Spinner label={label || 'Loading...'} color='secondary' labelColor='secondary' />
    </div>
  )
}
