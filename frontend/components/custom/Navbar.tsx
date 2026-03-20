'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SignUp from './SignUp';
import Login from './Login';
import Dropdown from './Dropdown';
import fetchWithAuth from '@/app/utils/fetchWithAuth';



const Navbar = () => {

    interface UserDataType{
        userId: string,
        userName: string,
        email: string,
    }

    const navLinks = [{linkName:'Home', link:'/'}, {linkName:'Products', link: '/products'}, {linkName:'About', link:'/about'}, {linkName:'Contact', link:'/contact'}];

    const [openLoginDialog, setOpenLoginDialog] = React.useState(false)
    const [openSignupDialog, setOpenSignupDialog] = React.useState(false)
    const [userData, setUserData] = useState<UserDataType | null>(null)
    const [loading, setLoading] = useState(true)

   
    

    useEffect(()=> {
       
        const getUserData = async()=> {
            setLoading(true)
            try {
                const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_AUTH_SERVICE}/api/auth-service/profile`, {
                    credentials: 'include'
                })
                

                if(response?.ok) {
                    const data = await response.json() 
                    setUserData(data)
                }
                else {
                    setUserData(null)
                }
            
            } catch (error) {
                setUserData(null)
                
            }
            finally{
                setLoading(false)
            }
        }

        getUserData()

    },[])


    console.log(userData)

    const logOutUser = async()=> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE}/api/auth-service/logout`, {
                method: 'POST',
                credentials: 'include'
            })

            const data = await response.json()
            console.log(data)
            
            setUserData(null)


        } catch (error) {
            console.log(error)
        }
    }


  return (
    <div>
        <nav className='w-full h-18 bg-white shadow-md text-black flex items-center justify-between px-20'>
            <div>
                <h1 className='text-xl font-bold'>E-commerce</h1>
            </div>

            <ul className='flex space-x-8 font-semibold'>
                {navLinks.map((links, index)=> {
                    return (
                        <Link key={index} href={links.link}><li className='cursor-pointer hover:scale-105 transition-all duration-300' >{links.linkName}</li></Link>
                    )
                })}
            </ul>

            <div className='flex items-center space-x-8'>

            
                {loading ? 
               ( <div className='w-24 h-8 bg-gray-100 animate-pulse rounded-lg'/>) :
               userData?.userName ?
               ( <div className='flex items-center gap-x-8'>
                        <div>
                            <input type="text" id='search' name='search' className='outline-none w-26 rounded-md border border-black/30 pl-1 focus:p-1 focus:w-40 transition-all duration-300' placeholder='Search...'/>
                        </div>

                        <div className='flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300'>
                           
                            <Dropdown userName = {userData?.userName}/>
                        </div>
                        
                        <Link href={'/my-cart'}>
                            <div className='flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300'>
                                <p className='text-xl text-black'>🛒</p>
                                <p className='text-xs font-medium'>My cart</p>
                            </div>
                        </Link>

                        <div>
                            <button  onClick={()=> logOutUser()} className='border rounded-lg bg-black text-white px-6 py-1 cursor-pointer hover:scale-103 duration-300 transition-all'>Sign Out</button>
                        </div>
                </div>)
                
                : 
                <div className='flex gap-x-6'>
                    <button onClick={()=> setOpenLoginDialog(true)} className='border rounded-lg bg-black text-white px-6 py-1 cursor-pointer hover:scale-103 duration-300 transition-all'>Sign in</button>
                    <button onClick={()=> setOpenSignupDialog(true)} className='border rounded-lg bg-black text-white px-6 py-1 cursor-pointer hover:scale-103 duration-300 transition-all'>Sign up</button>
                </div>
                
            }


            </div>

        </nav>

        { openSignupDialog &&   <SignUp setOpenSignupDialog={setOpenSignupDialog} setOpenLoginDialog= {setOpenLoginDialog}/>}
       {openLoginDialog && <Login setOpenLoginDialog={setOpenLoginDialog} setOpenSignupDialog= {setOpenSignupDialog} setUserData = {setUserData}/>}


            
    




    </div>
  )
}

export default Navbar