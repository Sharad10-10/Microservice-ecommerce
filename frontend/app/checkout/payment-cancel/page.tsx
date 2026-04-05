import { CircleX } from 'lucide-react'
import React from 'react'

const CancelPage = () => {
  return (
    <div className='mx-auto mt-8'>

        <div>

          <div className='flex flex-col items-center gap-1.5'>
            <CircleX className='text-red-500' size={96}/>
            <h1 className='text-lg font-medium'>Failed to process your payment! Please go back to your cart and try again</h1>
          </div>

          


        </div>


    </div>
  )
}

export default CancelPage