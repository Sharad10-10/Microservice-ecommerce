import Image from 'next/image'
import React from 'react'
import fetchWithAuth from '../utils/fetchWithAuth'
import { cookies } from 'next/headers'
import QuantityChanger from '@/components/custom/QuantityChanger'
import DeleteCart from '@/components/custom/DeleteCart'


interface cartDataType {
  cartCount : number,
  cartItems: [],
  totalAmount: number,
  userId: string
}

interface cartItemsType {

    image: string,
    name: string,
    price: number,
    quantity: number,
    productId: string

}

const MyCart = async() => {


  const getCartItems = async()=> {
    try {

        const cookieStore = cookies()
        const token = (await cookieStore).get('accessToken')?.value

      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_CART_SERVICE}/api/cart-service/my-cart`,{
        method: 'GET',
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Content-Type' : 'application/json',
          'Cookie' : `accessToken= ${token}`
        }
      })

      console.log(response)

      const data = await response?.json()
      return data


    } catch (error) {
      console.log("Failed to get cart items:",error)
    }
  }

  const cartData = await getCartItems()
  console.log('cart data', cartData)




  return (
    
  <div className='px-8 mb-16'>

      <div className='mt-20 ml-8 max-w-210 border p-8 bg-gray-50/80'>
        <div>
          <h1 className='text-3xl'>Shopping Cart</h1>
        </div>

        <div>
          <p className='flex justify-end mr-10'>Price</p>
          <div className='border-b border-black/20 max-w-200'/>
        </div>

        

       {cartData?.cartItems.map((cartItem:cartItemsType, index:string)=> {
        return (
              <div key={index}>
                  <div key={index} className='mt-8 flex gap-6'>
                  <div className='max-h-60 max-w-40 border overflow-hidden rounded-sm'>
                      <Image src={cartItem?.image} height={1000} width={1280} alt='image' className='h-30 w-35 object-cover'/>
                  </div>

                  <div className='w-full flex'>
                    <div className='w-full'>
                        <h1>{cartItem?.name}</h1>
                        <p>In Stock</p>
                        <p>Sold and shipped by E-commerce</p>

                       <QuantityChanger itemQuantity = {cartItem}/>
                    </div>

                  <DeleteCart cartItem = {cartItem}/>

                  </div>


                  <div className='border-b border-black/20 max-w-200 mt-4'/>
              </div>


              <div className='border-b border-black/20 max-w-200 mt-4'/>



              </div>


        )
       })}


        <div className='flex justify-end mt-4'>
          <p className='text-lg'>SubTotal ({cartData?.cartCount} items): <span className='font-semibold'>${cartData?.totalAmount}</span></p>
        </div>

      </div>

     


  </div>

  )
}

export default MyCart