'use client'
import React, { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import fetchWithAuth from '@/app/utils/fetchWithAuth'
import { useRouter } from 'next/navigation'


interface cartQuantityProps {

  itemQuantity : {
    image: string,
    name: string,
    price: number,
    quantity: number,
    productId: string
  },

}

const QuantityChanger = ({itemQuantity}: cartQuantityProps) => {


    const [changeNumber, setChangeNumber] = useState(itemQuantity?.quantity)
    const router = useRouter()



    const increaseQuantity = ()=> {

     const newNumber = changeNumber + 1

     setChangeNumber(newNumber)
     updateQuantity(newNumber)

    }
    const decreaseQuantity = ()=> {

      if(changeNumber < 1) {
        return 
      }

      const newNumber = changeNumber - 1
      setChangeNumber(newNumber)
      updateQuantity(newNumber)

    }


    const updateQuantity = async(updateNumber: number)=> {

      try {
          const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_CART_SERVICE}/api/cart-service/update/${itemQuantity?.productId}`,{
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify({quantity: updateNumber})
          })

          const data = await response?.json()
          console.log(data)

          if(response?.ok) {
            setChangeNumber(updateNumber)
            router.refresh()
            
          }



      } catch (error) {
        console.log(error)
      }


    }





  return (
    <div>

        <div className='flex gap-x-4 text-2xl items-center border-3 rounded-xl border-yellow-300 max-w-30 px-2 mt-2'>
            <span onClick={decreaseQuantity} className='cursor-pointer hover:scale-105 transition-all duration-300'><Minus /></span>
            <span className='text-[16px]'>{changeNumber}</span>
            <span onClick={increaseQuantity} className='cursor-pointer hover:scale-105 transition-all duration-300'><Plus /></span>
        </div>

    </div>
  )
}

export default QuantityChanger