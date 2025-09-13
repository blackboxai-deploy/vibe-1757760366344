import './globals.css';

export const metadata = {
  title: 'Lucky Wood - Forest Fortune Slot Game',
  description: 'Experience the magic of the forest in this exciting slot game featuring wooden reels, nature symbols, and bonus features.',
  keywords: 'slot game, casino, lucky wood, forest theme, online gaming',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Merriweather:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          body {
            font-family: 'Merriweather', serif;
          }
          .slot-title {
            font-family: 'Cinzel', serif;
          }
        `}</style>
      </head>
      <body className="antialiased">
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-amber-900">
          {children}
        </div>
      </body>
    </html>
  );
}