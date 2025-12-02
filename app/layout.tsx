import React from "react"
import "./globals.css"  // Add this import

export const metadata = {
  title: "Intentflow Demo",
  description: "Simple homepage showcasing the InjectionComponent",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}