import StorageGuard from './StorageGuard'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <StorageGuard />
        {children}
      </body>
    </html>
  )
}
