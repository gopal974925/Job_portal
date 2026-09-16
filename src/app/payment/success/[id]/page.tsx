"use client"
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import React from 'react'

const PaymentVerification = () => {
const {id}=useParams();

  return (
    <div className= 'min-h-screen flex items-center justify-center px-4 py-12 bg-secondary/30 '>
        <Card className='max-w-md w-full p-8 text-center shadow-lg border-2'>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle size={18} className='text-green-600'/>
            </div>
            <h1 className='text-3xl font-bold mb-2'>Paymen Succcessful</h1>
            <p className='text-base opacity-70 mb-8'>Your Subscription is now active .  Your id is {id}</p>
        </Card>
        <Link href={"/account"}>Go to Account Page</Link>
    </div>
  )
}

export default PaymentVerification