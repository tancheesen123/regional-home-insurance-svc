import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ChatbotWidget from "@/components/chatbot/chatbot-widget"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Etiqa Insurance - Comprehensive Coverage Solutions",
  description:
    "Get comprehensive insurance coverage with Etiqa. Home, auto, travel, and business insurance solutions tailored to your needs.",
  generator: "v0.app",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <ChatbotWidget />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
