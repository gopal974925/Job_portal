"use client"
import React, { useEffect, useState } from 'react'
import {User} from "@/type"
import { useParams } from 'next/navigation';
import { User_service } from '@/context/appContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loading } from '@/components/ui/loading';
import Info from '../(component)/info';
import Skills from '../(component)/skills';

const UserAcoountPage = () => {
    const [user,setUser]=useState<User | null>(null);
    const [loading,setloading]=useState(true)
    const {id}=useParams();

    useEffect(() => {
      async function fetchUser() {
        const token = Cookies.get("token")

        try {
          const { data } = await axios.get(`${User_service}/api/user/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setUser(data)
        } catch (error) {
          console.log(error)
        } finally {
          setloading(false)
        }
      }

      fetchUser()
    }, [id])

    if(loading) return <Loading/>
  return (
     <>
    {user && <div className='w-[90%] md:w-[60%] m-auto'>
        <Info user={user} isYourAccount={false}/>
         {user?.role === "jobseeker" && <Skills user={user} isYourAccount={false}/>}

        </div>}
    </>
  )
}

export default UserAcoountPage