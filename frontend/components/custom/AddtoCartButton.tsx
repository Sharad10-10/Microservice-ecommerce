'use client'
import fetchWithAuth from '@/app/utils/fetchWithAuth'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { circleCheck } from 'lucide'



interface FetchedProductProps{
    fetchedProduct: {
    _id: string,
    name : string,
    image: string,
    description: string,
    price: number,
    stock: number
}
}

const AddtoCartButton = ({fetchedProduct}: FetchedProductProps)=> {

    const [addedToCart, setAddedToCart] = useState(false)

   const handleCartAdd = async()=> {

    try {

        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_CART_SERVICE}/api/cart-service/add`, {
            method: 'POST', 
            headers: {
                'Content-Type' : 'application/json',

            },
            credentials: 'include',
            
            body: JSON.stringify({
               productId: fetchedProduct?._id,
               name: fetchedProduct?.name,
               price: fetchedProduct?.price,
               image: fetchedProduct?.image,
               quantity: 1

            })
        })

        if(!response?.ok) {
            return null
        }

        const data = await response.json()
        console.log(data)
        setAddedToCart(true)
        toast.success('Product added to your cart')



    } catch (error) {
        console.log(error)
    }


   }

  return (
    <div>
        {addedToCart ? <p className='px-6 py-2 text-lg flex items-center gap-1.5'> <span className='text-green-400 text-2xl'>✓⃝ </span>In cart </p> : <button onClick={handleCartAdd} className='border rounded-lg bg-black text-white px-6 py-2 cursor-pointer hover:scale-103 duration-300 transition-all'>Add To Cart</button>}
    </div>
  )
}

export default AddtoCartButton