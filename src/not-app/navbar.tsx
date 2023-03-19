import React from 'react'
import NavItem from '@/ui/navitem'
import Button from '@/ui/button'


export default function Navbar({ path }: { path: string }) {
  return (
    <nav className='flex justify-between items-center py-2 px-4 sm:px-8 md:px-16 lg:px-24'>
        <div className='font-bold cursor-pointer'> prompt.dev </div>
        <ul className='flex items-end gap-4 md:gap-8 lg:gap-12'>
            <NavItem path={path} mypath='home'> Home </NavItem>
            <NavItem path={path} mypath='skills'> Skills </NavItem>
            <NavItem path={path} mypath='ais'> AIs </NavItem>
            <NavItem path={path} mypath='about'> About </NavItem>

            <NavItem path={path} mypath='login'>
                <Button> Log In </Button>
            </NavItem>

            <NavItem path={path} mypath='signup'>
                <div className='border-[2px] border-blue-400 px-8 py-1 rounded-full'> Sign Up </div>
            </NavItem>
        </ul> 
    </nav>
  )
}
