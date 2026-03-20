import Image from 'next/image'
import React from 'react'

const RecentProduct = async() => {


    const fetchProducts = async()=> {

        const products = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE}/api/products/all-products`, {
            cache: 'no-store'
        })
        const data = await products.json()
        return data
    }

    const fetchedProducts = await fetchProducts()// Get the first 4 products
   

    const slicedProducts = fetchedProducts.slice(0, 4)

  


    interface ProductType {
        id:string;
        name: string;
        description: string;
        price: number;
        image: string
    }
    


  return (
    <div className='mt-24 mb-12'>
        <div className='text-center'>
            <h1 className='text-xl font-semibold'>Recent Products</h1>
            <h3 className='text-sm text-black/40'>Discover our latest products here</h3>
        </div>



       <div className='flex justify-around gap-y-8 flex-wrap mt-8'> 
        {slicedProducts?.map((product: ProductType, index: string)=> {
            return (
                <div key={index} className='h-110 w-80 border border-black/30 rounded-md overflow-hidden'>
                    <div>
                        <Image src={product?.image} alt={product?.name} className='h-70 object-cover' height={800} width={1000}/>
                    </div>
                    <div className='pl-3 pt-4'>
                        <h1 className='text-lg font-medium'>{product?.name}</h1>
                        <h2 className='text-sm text-black/70'>{product?.description}</h2>
                    </div>
                    <p className='text-lg font-semibold pl-3 pt-2'>${product?.price}</p>
                    <div className='flex justify-center px-2 pt-1'>
                        <button className='border w-full rounded-lg bg-black text-white px-4 py-2 cursor-pointer hover:scale-103 duration-300 transition-all'>Add to Cart</button>
                    </div>
                </div>
            )
        })}
       </div>
    </div>
  )
}

export default RecentProduct