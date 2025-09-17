import React from 'react'
import { InputOTP, InputOTPSlot, Separator } from '@creo/ui'

export default function RegisterFormEmailVerificationStep() {
  return (
    <div className='flex flex-col items-center gap-4'>
      <p className='text-3xl font-light'>Enter One-Time Code:</p>
      
      <div className='mt-4'>
        <InputOTP maxLength={6}>
        <InputOTPSlot index={0} className='w-20 h-20 rounded-2xl text-4xl font-thin bg-black'/>
        <InputOTPSlot index={1} className='w-20 h-20 rounded-2xl text-4xl font-thin bg-black'/>
        <InputOTPSlot index={2} className='w-20 h-20 rounded-2xl text-4xl font-thin bg-black'/>
        <InputOTPSlot index={3} className='w-20 h-20 rounded-2xl text-4xl font-thin bg-black'/>
        <InputOTPSlot index={4} className='w-20 h-20 rounded-2xl text-4xl font-thin bg-black'/>
        <InputOTPSlot index={5} className='w-20 h-20 rounded-2xl text-4xl font-thin bg-black'/>
      </InputOTP>
      </div>
      
      <Separator className='mt-4'/>
      <h2 className='text-lg'>We sent your email a passcode. Please enter it here to confirm your account.</h2>
    </div>
  )
}
