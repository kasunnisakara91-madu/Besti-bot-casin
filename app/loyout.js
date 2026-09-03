import "./globals.css";

export const metadata = {
  title: "BESTIE-MINI-FREE CASE",
  description: "BESTIE-MINI-FREE Case Hub"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
