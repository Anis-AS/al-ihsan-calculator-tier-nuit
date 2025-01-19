export const metadata = {
  title: 'Calculateur Premier Tiers - Institut Al-Ihsan',
  description: 'Calculateur du premier tiers de la nuit',
}

import '@/styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
