import React from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from 'lucide-react'
import Link from 'next/link'

interface DropdownProps {
    userName: string
}

const Dropdown = ({userName} : DropdownProps) => {
  return (
    <div>
            <DropdownMenu >
            <DropdownMenuTrigger className={'cursor-pointer'} render={<Button variant="outline" />}>
                <User />
                <span>{userName}</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
            
               
                <Link href={'/my-orders'}><DropdownMenuItem className={'text-[16px] font-medium cursor-pointer'}>My Orders</DropdownMenuItem></Link>
               
               
            </DropdownMenuContent>
            </DropdownMenu>


    </div>
  )
}

export default Dropdown