'use client';

import React from 'react';
import { profileSchema } from '@/app/lib/schemas/registerSchema';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CardWrapper from '@/components/CardWrapper';
import { RiProfileLine } from 'react-icons/ri';
import ProfileForm from '../register/ProfileForm';
import { Button } from '@nextui-org/react';
import { completeSocialLoginProfile } from '@/app/actions/authActions';
import { signIn } from 'next-auth/react';

export default function CompleteProfileForm() {
  const methods = useForm<profileSchema>({resolver: zodResolver(profileSchema),mode: 'onTouched'});
  const {handleSubmit, formState: {errors, isSubmitting, isValid}} = methods;
  
  const onSubmit = async (data: profileSchema) => {
    const result = await completeSocialLoginProfile(data);

    if(result.status === 'success') {
        signIn(result.data, {
            callbackUrl: '/members'
        })
    }
  }
  return (
    <CardWrapper headerText='About you' subHeaderText='Complete your dating profile' headerIcon={RiProfileLine}
    body={
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='space-y-4'>
                    <ProfileForm />
                    {errors.root?.serverError && (<p className='text-danger text-sm'>{errors.root.serverError.message}</p>)}
                    <div className='flex flex-row items-center gap-6'>
                      <Button isLoading={isSubmitting} isDisabled={!isValid} fullWidth color='secondary' type='submit'>Submit</Button>
                    </div>
                </div>
            </form>
          </FormProvider>
    }
    />
  )
}
