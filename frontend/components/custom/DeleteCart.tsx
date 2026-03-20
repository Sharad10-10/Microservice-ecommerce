'use client'
import fetchWithAuth from '@/app/utils/fetchWithAuth'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'



interface cartDataType {
    cartItem : {
        productId: string,
        name: string,
        price: number,
    }
}

const DeleteCart = ({cartItem}: cartDataType) => {

    const router = useRouter()

    const deleteItemsFromCart = async()=> {

        try {
            const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_CART_SERVICE}/api/cart-service/delete/${cartItem?.productId}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            const data = await response?.json()
            console.log(data)

            router.refresh()


        } catch (error) {
            console.log(error)
        }
    }

  return (
 
        <div className='flex flex-col items-center justify-between'>
            <p className='font-semibold'>${cartItem?.price}</p>
            <p onClick={deleteItemsFromCart} className='flex gap-2 cursor-pointer hover:scale-105 transition-all duration-300'><Trash2 /> <span>Delete</span> </p>
        </div>
    
  )
}

export default DeleteCart