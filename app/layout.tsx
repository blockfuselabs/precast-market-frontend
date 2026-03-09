import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata: Metadata = {
    title: "Precast | The World's Largest Prediction Market",
    description:
        "Trade on real-world events with Precast - the world's largest prediction market platform",
}

import { Providers } from "@/components/providers/providers"
import { Toaster } from "sonner"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased`}>
                <Providers>{children}</Providers>
                <Toaster theme="dark" position="top-center" richColors />
            </body>
        </html>
    )
}
