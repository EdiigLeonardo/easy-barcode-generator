import type { Metadata } from "next";
import "./globals.css";

// npx tsc watch
export const metadata: Metadata = {
  title: "Barcode Generator",
  description: "Generate barcodes from input values",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
