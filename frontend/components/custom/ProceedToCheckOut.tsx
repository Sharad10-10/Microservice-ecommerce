'use client'
import React from 'react'





interface CartDataProps {
    userId: string,
    userEmail: string,
    totalAmount: number,
    cartCount: number,
    cartItems : {
        name: string,
        price: number,
        quantity: number,
        image: string
    }[]
}

interface ProceedToCheckOutProps {
    cartData : CartDataProps
}



const ProceedToCheckOut = ({cartData}: ProceedToCheckOutProps) => {


    const calculateTax = Number((cartData?.totalAmount * 13)/100 )
    const shippingFee = 5


    console.log("Cart items data", cartData?.cartItems)

    const handleCheckout = async() => {

        try {
            
            const response = await fetch('http://localhost:3003/checkout/create-session', {

                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    userId: cartData?.userId,
                    totalAmount: Number(cartData?.totalAmount + calculateTax + shippingFee),
                    cartItems: cartData?.cartItems,
                    customerEmail: cartData?.userEmail,
                    
                })
            })

            const data = await response.json()
            console.log("proceed to checkout data",data)

            

            if(data?.sessionUrl) {
                window.location.href = data.sessionUrl
            }

        } catch (error) {
            console.log(error)
        }


    }



  return (
    <div className='max-w-200 w-full'>
        <div className='mt-20 border border-black/20 bg-gray-50/80 p-6 w-100'>
            
                <div>
                    <h1 className='text-xl font-semibold'>Order Summary</h1>
                </div>

                <div className=''>

                        <div className='mt-8 flex justify-between'>
                            <div className='flex flex-col gap-2 justify-center'>
                                <p>Subtotal ({cartData?.cartCount} {cartData?.cartCount > 1 ? 'items' : 'item'}):</p>
                                <p>Shipping Fee:</p>
                                <p>Tax (GST/HST):</p>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <p>${(cartData?.totalAmount)}</p>
                                <p>${(shippingFee).toFixed(2)}</p>
                                <p>${(calculateTax).toFixed(2)}</p>
                            </div>

                           
                        </div>

                        <div className='border-b border-black/30 mt-4'/>

                        <div className='flex justify-between'>
                            
                            <div className='mt-6'>
                                <p>Total: </p>
                            </div>

                            <div className='mt-8'>
                                <p>{(cartData?.totalAmount + calculateTax + shippingFee).toFixed(2)}</p>
                            </div>
                        </div>

                        <div onClick={handleCheckout} className='flex justify-center mt-8'><button className='border rounded-lg bg-black text-white px-6 py-2 cursor-pointer hover:scale-103 duration-300 transition-all'>Proceed to Checkout</button></div>
                </div>

               



        </div>

       
    </div>
  )
}

export default ProceedToCheckOut