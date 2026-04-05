import AddtoCartButton from '@/components/custom/AddtoCartButton'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'



const SingleProductPage = async({params}: {params: {id: string}}) => {


    const {id}= await params
    console.log("Received Params", id)

    

    const fetchProductById = async(id: string)=> {
        const product = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE}/api/products/all-products/${id}`, {
            cache: 'no-store'})
        
        const data = await product?.json()
        console.log('first', data)
        return data
    }

    const fetchedProduct = await fetchProductById(id)
    console.log('Product:', fetchedProduct)

 

  return (
    <div>
        <div className='flex gap-12 mt-14 pl-40'>
            <div className='border max-h-160 max-w-100 overflow-hidden rounded-sm'>
                <Image src={fetchedProduct?.image} alt='image' width={1000} height={800} className='object-cover'/>
            </div>

            <div className='max-w-100 w-full'>
                <h1 className='text-lg font-semibold'>{fetchedProduct?.name}</h1>
                <p className='pt-6 text-black/80 font-medium'>{fetchedProduct?.description}</p>
                <p className='text-lg font-semibold pt-4'>${fetchedProduct?.price}</p>

                <div className='flex gap-4 mt-8'>
                    <AddtoCartButton fetchedProduct = {fetchedProduct} />
                    <Link href={'/my-cart'}><button className='border rounded-lg bg-black text-white px-6 py-2 cursor-pointer hover:scale-103 duration-300 transition-all'>Buy Now</button></Link>
                </div>

                <div className='border-b  border-black/40 mt-4'/>

                <div className='flex justify-between mt-4'>
                    <p className='font-semibold'>Category: <span className='text-black/60'>Premium</span></p>
                    <p className='font-semibold'>Availability: <span className='text-black/60'>{fetchedProduct?.stock > 0 ? 'In Stock' : ''}</span></p>
                </div>


            </div>

        </div>


    </div>
  )
}

export default SingleProductPage