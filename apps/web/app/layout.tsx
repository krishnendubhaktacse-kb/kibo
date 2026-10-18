import { Geist, Geist_Mono } from "next/font/google"
import { ClerkProvider } from '@clerk/nextjs'

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { cn } from "@workspace/ui/lib/utils";
import { Toaster } from "@workspace/ui/components/sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#266cee"
            }
          }}
        >
        <Providers><Toaster />
        <div className="h-svh w-full">
        {children}
        </div>
        </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
