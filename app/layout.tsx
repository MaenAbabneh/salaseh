import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Salaseh",
  description:
    "The official platform for the Jordanian comedy troupe Al-Salaseh. Buy tickets, listen to the podcast, and get to know the band.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session={session}>
      <body className={`${poppins.variable}  antialiased`}>
        {children}
        <Toaster />
      </body>
      </SessionProvider>
    </html>
  );
}
