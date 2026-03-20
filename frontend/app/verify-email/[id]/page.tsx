import Link from "next/link"
import React from "react"

const VerificationPage = async({ params} : {params: {id: string}}) => {

  const { id } = await params
  
  const verifyEmail = async()=> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE}/api/auth-service/verify-email/${id}`)
      const data = await response.json()
      return response


    } catch (error) {
        console.log('Something went wrong!',error)
    }

}

  const fetchedResponse = await verifyEmail()


  return (
    <div className='text-center mt-10'>
        <div>
          <h1 className='text-[18px]'>Thank you for confirmation</h1>
          <h2>{fetchedResponse?.ok ? 'You can now login to your account': ''}</h2>
          <Link href={'/'}><h1 className='text-xl font-semibold mt-2 cursor-pointer'>Login</h1></Link>
        </div>
    </div>
  )
}

export default VerificationPage