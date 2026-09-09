"use client"

import { Loading } from '@/components/ui/loading'
import { useAppData } from '@/context/appContext'

import React from 'react'
import Info from './(component)/info'
import Skills from './(component)/skills'
import Company from '@/components/company'

const AccountPage = () => {
    const { isAuth,user, loading } = useAppData();
    if (loading) return <Loading />

    return (
    <>
    {user && <div className='w-[90%] md:w-[60%] m-auto'>
        <Info user={user} isYourAccount={true}/>
        {user?.role === "jobseeker" && <Skills user={user} isYourAccount={true}/>}
        {user?.role === "jobrecruiter" && <Company />}
        </div>}
    </>
  )
}

export default AccountPage