import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Magical Board - Collaborative Whiteboard',
  description: 'A magical collaborative whiteboard inspired by Sailor Moon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}