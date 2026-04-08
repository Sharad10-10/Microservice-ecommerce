import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from 'next/link';
import Image from 'next/image';
import RecentProduct from './RecentProduct';
import { ArrowRight } from 'lucide-react';

const Hero = () => {

  const slidesData = [

    {
      id: 1,
      tag: "Summer Sale — Up to 50% Off",
      heading: "Big Deals,\nBigger Style",
      subtext: "Limited time offers on hundreds of items. Don't miss out on this season's best picks.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
     
    },

    {
      id: 2,
      tag: "Trending Now",
      heading: "Dress to\nImpress",
      subtext: "From casual outings to special occasions — find the perfect outfit for every moment.",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80",
      
    },
    
    {
      id: 3,
      tag: "New Arrivals",
      heading: "Step Into the\nNew Season",
      subtext: "Fresh styles, bold looks. Discover our latest women's collection handpicked for you.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80",
     
    },

    {
      id: 4,
      tag: "Members Get More",
      heading: "Join & Save\nEvery Day",
      subtext: "Sign up for free and unlock exclusive discounts, early access, and style tips.",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
   
    },
]


  return (
    
    <div className='mt-24'>

      <Carousel className="w-full">
        <CarouselContent>
            {slidesData.map((slide) => (
            <CarouselItem key={slide.id}>
                <div className="relative w-full h-120">

                  <Image src={slide.image} alt={slide.tag} width={1200} height={800} className="absolute inset-0 w-full h-full object-cover" />

                  <div className="absolute inset-0 bg-black/40" />

                  <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-24">
                      <span className="text-white/70 text-xs uppercase tracking-widest mb-3">{slide.tag}</span>
                      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-xl leading-tight">{slide.heading}</h1>
                      <p className="text-white/80 text-base mb-8 max-w-md">{slide.subtext}</p>
                      <div className="flex items-center gap-4">
                        <Link href='/products' className="bg-white text-gray-900 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-gray-100" >
                            Shop Now
                        </Link>
                      </div>
                  </div>

                </div>
            </CarouselItem>
            ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 border-none text-white cursor-pointer" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 border-none text-white cursor-pointer"/>
      </Carousel>


      <div>
        <RecentProduct />
      </div>

      <Link href={'/products'} className='flex items-center ml-10 mb-10 gap-2 text-sm max-w-35 text-black/60 hover:scale-105 transition-all duration-300'>
      See all Products<ArrowRight className='text-2xl' /> 
      </Link>


</div>
    
    
    
        
    
  )
}

export default Hero