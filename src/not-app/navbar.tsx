import React from 'react'
import NavItem from '@/ui/navitem'
import Button from '@/ui/button'
import Link from 'next/link'

import { useUser } from '@auth0/nextjs-auth0/client'

export default function Navbar({ path }: { path: string }) {
  const { user, checkSession } = useUser();

  return (
    <nav className='flex justify-between items-center py-2 px-4 sm:px-8 md:px-16 lg:px-24'>
        <div className='font-bold cursor-pointer'> prompt.dev </div>
        <ul className='flex items-end gap-4 md:gap-8 lg:gap-12'>
            <NavItem path={path} mypath='home'> Home </NavItem>
            <NavItem path={path} mypath='skills'> Skills </NavItem>
            <NavItem path={path} mypath='ais'> AIs </NavItem>
            <NavItem path={path} mypath='about'> About </NavItem>

            { !user && 
            <>
              <NavItem path={path} mypath='login'>
                <Link href={'/api/auth/login'}>
                  <Button> Log In </Button>                
                </Link>
              </NavItem>
              <NavItem path={path} mypath='signup'>
                <Link href={'/api/auth/login'}>
                  <div className='border-[2px] border-blue-400 px-8 py-1 rounded-full'> Sign Up </div>
                </Link>
              </NavItem>            
            </> 
            }

            { user &&  
            <>
              <NavItem path={path} mypath='profile'>
                <Link href={'/profile'}>
                  <Button> Profile </Button>
                </Link>
              </NavItem>
              <NavItem path={path} mypath='logout'>
                <Link href={'/api/auth/logout'}>
                  <div className='border-[2px] border-blue-400 px-8 py-1 rounded-full'> Log Out </div>                
                </Link>
              </NavItem>
            </>
            }
            
        </ul> 
    </nav>
  )
}