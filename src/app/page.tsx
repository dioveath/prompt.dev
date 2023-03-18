import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from './navbar'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={`w-screen min-h-screen h-full ${inter.className}`}>
      <Navbar path='home'/>
    </main>
  )
}
