'use client'
import { X } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

interface UserDataType{
  userId: string,
  userName: string,
  email: string,
}

type DialogProps = {
  setOpenLoginDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setOpenSignupDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>,
 
}



const Login = ({ setOpenLoginDialog,setOpenSignupDialog, setUserData}: DialogProps ) => {


    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
      email: '',
      password: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
      const {name, value} = e.target
      setFormData({
        ...formData,
        [name] : value
      })
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async(e)=> {
      e.preventDefault()

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE}/api/auth-service/login`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })

        const data = await response.json()
       
        if(data?.success) {

          setUserData(data?.user)
          setFormData({
            email: '',
            password: ''
          })

          setOpenLoginDialog(false)

          toast.success(data?.message)
        }
        else {
          toast.error(data?.message)
        }

        
        
  

      } catch (error) {
        console.log(error)
      }
    }



  return (
    <div className='inset-0 fixed top-0 bg-black/30 w-screen flex items-center justify-center z-10'>

            <div className='bg-white max-h-100 h-full max-w-100 w-full rounded-lg p-2 z-20'> 
    
                    <div className='w-full flex flex-col mt-4'>
                    <div onClick={()=> setOpenLoginDialog(false)} className='flex justify-end mr-2 -mt-2 cursor-pointer'><X /></div>
                        <div className='text-center text-lg font-semibold'>
                            <h1>Login to continue shopping</h1>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className='mt-8 w-full flex flex-col gap-6 items-center justify-center'>
                            
                                <div className='flex flex-col gap-2 w-full items-center justify-center'>
                                    <input onChange={handleInputChange} className='outline-none border border-black/40 p-2 rounded-sm max-w-80 w-full focus:border-blue-400' value={formData.email} type="email" placeholder='Email' id='email' name='email' required />
                                </div>

                                <div className='flex flex-col gap-2 w-full items-center justify-center'>
                                      <input onChange={handleInputChange} className='outline-none border border-black/40 p-2 rounded-sm max-w-80 w-full focus:border-blue-400' value={formData.password} type={showPassword ? 'text' : 'password'} placeholder='Enter password' id='password' name='password' required />
                                      <p onClick={()=>setShowPassword(!showPassword)} className='text-left text-sm text-black/65 cursor-pointer'>👁️ Show Password</p>
                                </div>

                                <div>
                                      <p>Don't have an account? <span onClick={()=> {setOpenLoginDialog(false); setOpenSignupDialog(true)}} className='font-semibold cursor-pointer'>Signup</span></p>
                                </div>

                                <div className='mt-1'>
                                      <button className='border w-full text-center rounded-lg bg-black text-white px-6 py-2 cursor-pointer hover:scale-103 duration-300 transition-all'>Login</button>
                                </div>
                           </div>
                        </form>
                    </div>       
            </div>

            

    </div>


  )
}

export default Login