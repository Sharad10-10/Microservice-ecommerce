import { CheckCircle, CircleDollarSign, Store, WalletIcon } from 'lucide-react'
import React from 'react'


const PaymentSuccessPage = async({ searchParams }: { searchParams: { session_id: string } }) => {


  const { session_id } = await searchParams
  
  console.log('session id', session_id)

  const fetchPaymentData = async()=> {

    try {

      const response = await fetch(`http://localhost:3003/checkout/session/${session_id}`)
      const data = await response.json()
      return data

    } catch (error) {
      console.log(error)
    }

  }

  const fetchedPaymentData = await fetchPaymentData()
  console.log(fetchedPaymentData)

  const filterFetchedData = fetchedPaymentData?.lineItems.filter(lineItem => lineItem?.description !== 'Tax(13%)' && lineItem?.description !== 'Shipping Fee')

  console.log("Filtered data", filterFetchedData)



  return (
    <div className='m-auto w-full'>
        <div>
            <div>
                <div className='bg-green-200 rounded-full h-18 w-18 flex items-center justify-center text-center mx-auto'>
                  <CheckCircle className='text-green-500' size={48}/>
                </div>

                <div className='mx-auto text-center'> 
                  <h1 className='text-2xl font-semibold'>Payment Successful</h1>
                  <h2 className='text-black/40'>Thank you for your purchase. Your order has been confirmed</h2>
                </div>
            </div>


            <div className='max-w-200 w-full border mx-auto rounded-sm mt-2'>
                <div className='flex justify-between items-center p-4'>
                  <h1 className='font-semibold text-black/70'>Order Confirmation</h1>
                  <p className='bg-green-200 rounded-full p-2 text-black text-sm'>PAID</p>
                </div>

                <div className='px-4'>
                  
                    <div className='flex flex-col gap-4 mb-4'>
                      <div className='flex gap-2'>
                            <WalletIcon />
                            <div className='flex flex-col justify-center text-wrap'>
                              <p className='font-medium'>Email</p>
                              <p className='text-black/80'>{fetchedPaymentData?.metadata?.customerEmail}</p>
                            </div>
                        </div>

                      <div className='flex gap-2'>
                          <WalletIcon />
                          <div className='flex flex-col justify-center text-wrap'>
                            <p className='font-medium'>Transaction Id</p>
                            <p className='text-black/80'>{session_id}</p>
                          </div>
                      </div>

                      <div>
                        <div className='flex gap-1.5'>
                          <CircleDollarSign />
                          <div className='flex flex-col justify-center text-wrap'>
                            <p className='font-medium'>Amount</p>
                            <p className='text-black/80'>${(fetchedPaymentData?.totalAmount).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className='flex gap-1.5'>
                          <CircleDollarSign />
                          <div className='flex flex-col justify-center text-wrap'>
                            <p className='font-medium'>Transaction Date</p>
                            <p className='text-black/80'>{(fetchedPaymentData?.createdAt).slice(0,10)}</p>
                          </div>
                      </div>
                    </div>

                      <div>
                        <div className='flex items-center gap-1.5'>
                          <Store />
                          <h1 className='font-medium'>Items:</h1>
                        </div>
                        <div>
                          {filterFetchedData?.map((lineItem)=> {
                            return (
                              <div key={lineItem?.id} className='flex items-center justify-between mt-2 text-black/80 pl-8 pr-2'>
                                <div>
                                  <p>{lineItem?.description} x {lineItem?.quantity}</p>
                                </div>

                                <div>
                                  <p>${(lineItem?.amount_total)/100}</p>
                                </div>
                              </div>

                            )




                          })}
                        </div>
                      </div>

                    </div>





                </div>
            </div>




        </div>
    </div>
  )
}

export default PaymentSuccessPage