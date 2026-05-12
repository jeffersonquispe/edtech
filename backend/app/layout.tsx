export const metadata = {
  title: 'EdTech API',
  description: 'Backend API for EdTech platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
