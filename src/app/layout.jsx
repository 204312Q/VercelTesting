import 'src/global.css';

export const metadata = {
  title: 'Chilli Padi Confinement',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
