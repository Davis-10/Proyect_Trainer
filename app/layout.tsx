import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "FitScience | Entrenador Personal Basado en Ciencia",
  description:
    "Transforma tu cuerpo con planes de entrenamiento personalizados basados en fisiología, anatomía y ciencias del deporte. Seguimiento de progreso, planificación inteligente y resultados reales.",
  keywords: [
    "entrenador personal",
    "fitness",
    "entrenamiento",
    "ciencias del deporte",
    "fisiología",
    "planes de entrenamiento",
  ],
  authors: [{ name: "FitScience" }],
  openGraph: {
    title: "FitScience | Entrenador Personal Basado en Ciencia",
    description:
      "Transforma tu cuerpo con planes de entrenamiento personalizados basados en ciencia real.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#0E5673",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
