import './globals.css'
// import { Inter } from 'next/font/google'
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// const inter = Inter({ subsets: ['latin'] })
// body className="{inter.className} bg-gray-900">

export const metadata = {
  title: 'standardloop.dev',
  description: 'standardloop.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
