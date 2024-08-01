
import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';

export default function EmptyState() {
  return (
    <div className='flex justify-center items-center mt-20'>
        <Card className='p-5'>
            <CardHeader className='text-3xl text-secondary'>
                No results found
            </CardHeader>
            <CardBody className='text-center'>
                Please adjust your filters
            </CardBody>
        </Card>
    </div>
  )
}
