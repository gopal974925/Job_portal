"use client"
import useRazorpay from '@/components/scriptloader'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { payment_service, useAppData } from '@/context/appContext';
import toast from 'react-hot-toast/headless';
import { Loading } from '@/components/ui/loading';
import {Card} from "@/components/ui/card"
import { CheckCircle, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SubscriptionPage = () => {
const razorpayLoaded=useRazorpay();

const router=useRouter();
const [loading,setLoading]=useState(false);

const {setUser}=useAppData();

const handleSubscribe=async()=>{
    const token=Cookies.get("token");
    setLoading(true);
    try {
        const { data } = await axios.post(`${payment_service}/api/payment/checkout`,
            {}
            ,{
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
        );
        const order = data?.order || data;
        
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
            amount: order.amount || 100, // Amount is in currency subunits.
            currency: 'INR',
            name: 'Acme Corp',
            description: 'Test Transaction',
            order_id: order.id, // This is the order_id created in the backend
            handler:async function(response:any) {
                const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=response;
                try {
                    const {data}=await axios.post(`${payment_service}/api/payment/verify`,
                        {razorpay_order_id,razorpay_payment_id,razorpay_signature},
                        {
                            headers:{
                                Authorization:`Bearer ${token}`
                            }
                        }
                    )
                    toast.success(data.message)
                    setUser(data.updateduser)
                    router.push(`/payment/success/${razorpay_payment_id}`)
                } catch (error:any) {
                    setLoading(false);
                    toast.error(error.response?.data?.message || "Payment verification failed")
                }
            },
            theme: {
              color: '#F37254'
            },
          };

          if(!razorpayLoaded){
            toast.error("Razorpay SDK failed to load");
            setLoading(false);
            return;
          }

          const razorpay=new window.Razorpay(options)
          razorpay.open()
          setLoading(false);
    } catch (error: any) {
        setLoading(false);
        toast.error(error.response?.data?.message || "Checkout failed");
    }
};

  if(loading) return <Loading/>

  return (
    <div className='min-h-screen flex items-center justify-items-center px-4 *:py-4
        bg-secondary/30'>
            <Card className='max-w-md w-full p-8 text-center shadow-lg border-2'>
                <div className="inline-flex items-center justify-center w-16
                h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4 ">
                    <Crown size={32} className='text-blue-500'/>
                </div>
                <h1 className='text-3xl font-bold mb-2'>Premium SubsCription</h1>
                <div className='mb-6'>
                    <p className='text-5xl font-bold text-blue-000'>$1</p>
                <p className='text-sm opacity-50 mt-1'>Per Month</p>
                </div>

                <div className='space-y-3 mb-8 text-left'>
                    <div className="flex items-start gap-3 ">
                        <CheckCircle size={20} className='text-green-600 shrink-0 mt-0.5'/>
                        <p className='text-sm'>Your Application will Be shown to recruiters</p>
                    </div>
                </div>

                <div className='space-y-3 mb-8 text-left'>
                    <div className="flex items-start gap-3 ">
                        <CheckCircle size={20} className='text-green-600 shrink-0 mt-0.5'/>
                        <p className='text-sm'>Priority Support</p>
                    </div>
                </div>
                <Button disabled={!razorpayLoaded} onClick={handleSubscribe} className={"w-full h-12 text-base gap-2"}>
                <Crown size={18}/>
Subscribe
                </Button>
                

            </Card>
        </div>
  )
}

export default SubscriptionPage