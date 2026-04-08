import React from 'react'
import fetchWithAuth from '../utils/fetchWithAuth'
import { cookies } from 'next/headers'

const MyOrdersPage = async() => {

  
  const cookieStore = await cookies()
  const token = (await cookieStore).get('accessToken')?.value

  const getMyOrders = async()=> {

    try {

        const response = await fetchWithAuth('http://localhost:3004/api/orders/get-orders', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Cookie' : `accessToken= ${token}`
            
          }
        })

        const data = await response?.json()
        return data



    } catch (error) {
      console.log(error)
    }


  }

  const fetchedOrders = await getMyOrders()
  





  return (
    <div className='flex justify-center mt-12 px-4'>

      <div className='max-w-240 w-full'>

        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-xl font-medium'>My Orders</h1>
          <p className='text-sm text-black/60'>Recently made orders are below</p>
        </div>

      {fetchedOrders?.orders?.map((order, index)=> {
        return (
          <div key={index} className='w-full mt-8 mb-8'>

                  <div className='flex justify-between items-center px-4 border bg-[#F1F2F2] rounded-t-lg py-1 text-sm md:text-[16px] gap-x-2 sm:gap-x-0'>
                      <div className='flex items-center sm:gap-x-16 gap-x-2'>
                          <p className='flex flex-col flex-wrap'>Order Placed: <span>{(order?.createdAt).slice(0,10)}</span></p>
                          <p className='flex flex-col flex-wrap'>Total: <span>${(order?.totalAmount).toFixed(2)}</span></p>
                          <p className='flex flex-col flex-wrap'>Ship to: <span className='text-sm text-black/70'>{fetchedOrders?.userEmail}</span></p>
                      </div>

                      <div>
                          <p className='flex flex-col flex-wrap'>Order: <span className='text-[12px] text-black/70'>{order?._id}</span></p>
                      </div>
                  </div>

              <div className='flex justify-between border border-t-0 rounded-b-lg px-4 pb-2'>
                <div className=''>
                    {order?.products?.map((product, index)=> {
                        return (

                          <div key={index} className='flex items-center mt-4'>
                                <div>
                                  <p>{product?.name}</p>
                                  <p>Quantity: {product?.qty}</p>
                                  <p>{order?.paymentStatus}</p>
                                </div>
                          </div>

                        )
                      })}

                </div>

                <div className='flex flex-col justify-end'>
                  <p>Total Amount: {(order?.totalAmount).toFixed(2)}</p>
                </div>


              </div>

          </div>


        )
      })}


      </div>



    </div>
  )
}

export default MyOrdersPage