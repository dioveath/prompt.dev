import React from 'react'

export default function Navbar({ path }: { path: string }) {
  return (
    <nav className='flex justify-between items-center py-2 px-4 sm:px-8 md:px-16 lg:px-24 text-primary'>
        <div className='font-bold'> prompt.dev </div>
        <div> 
            <ul className='flex items-center gap-4 md:gap-8 lg:gap-12 font-light'>
                <NavItem path={path} mypath='home'> Home </NavItem>
                <NavItem path={path} mypath='skills'> Skills </NavItem>
                <NavItem path={path} mypath='ais'> AIs </NavItem>
                <NavItem path={path} mypath='about'> About </NavItem>

                <NavItem path={path} mypath='login'> 
                    <div className='border-[2px] border-black px-8 py-1 rounded-full'> Login </div>
                </NavItem>

                <NavItem path={path} mypath='signup'>
                    <div className='border-[2px] border-blue-400 px-8 py-1 rounded-full'> Sign Up </div>
                </NavItem>
            </ul> 
        </div>
    </nav>
  )
}


const NavItem = ({ children, path, mypath } : { children: React.ReactNode, path: string, mypath: string }) => {
    return (
        <li className={`cursor-pointer hover:text-blue-400 ${path === mypath ? 'text-blue-500' : 'text-black'}`}> { children } </li>
    );
}