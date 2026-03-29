import type { Metadata, Viewport } from 'next'
import { Inter, Oswald } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { CartProvider } from '@/lib/cart/cart-context'
import { CartDrawer } from '@/components/cart-drawer'
import './globals.css'

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  title: 'La Casa del Minero - Productos de Minería',
  description: 'Tu proveedor de confianza en equipos, herramientas y suministros para la industria minera. Calidad, seguridad y experiencia al servicio de tu operación.',
  generator: 'v0.app',
  icons: {
    icon: '/Logo2.png',
    apple: '/Logo2.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a5dab',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${_inter.variable} ${_oswald.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <CartDrawer />
          <Toaster position="bottom-right" richColors />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
