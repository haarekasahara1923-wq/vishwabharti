import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vishwa Bharti Higher Secondary School, Pinto Park, Gwalior",
  description: "Official website of Vishwa Bharti Higher Secondary School, Sainik Colony, Pinto Park, Gwalior (MP) — Est. 1964",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

