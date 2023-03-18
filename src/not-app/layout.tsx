import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'prompt.dev',
  description: 'Teach yourself to prompt an ai. The next big skill of new generation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body className='bg-[#efefef]'>{children}</body>
    </html>
  )
}
