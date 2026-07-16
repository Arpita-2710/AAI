import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

import Providers from './providers'

export const metadata = {
  title: 'AAI Smart Washroom Portal',
  description: 'Airports Authority of India unified washroom telemetry, incidents and access audits platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Plus+Jakarta+Sans:wght@200..800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <Providers>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
