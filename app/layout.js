import './globals.css'

export const metadata = {
  title: 'The Ink Atlas — Find Tattoo Artists Worldwide',
  description: 'A curated directory of tattoo artists. Browse by city and style. No ads, no algorithm, no noise.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
