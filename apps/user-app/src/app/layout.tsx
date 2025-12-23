import type { Metadata } from 'next'
import { AppProviders } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'TaskFlow',
  description: 'Organize your tasks and boost your productivity',
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

