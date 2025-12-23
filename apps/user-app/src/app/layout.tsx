import type { Metadata } from 'next'
import { AppProviders } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'User Todo Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}

