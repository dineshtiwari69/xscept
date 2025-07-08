import './globals.css'
import { Inter } from 'next/font/google'
import RootProviders from './providers'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Example Tauri v2 Python sidecar',
  description: 'Template for tauri and python sidecar project.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootProviders>
          {children}
        </RootProviders></body>
    </html>
  )
}
