import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/custom/Navbar";
import { ToastContainer } from "react-toastify";


export const metadata: Metadata = {
  title: "E-commerce",
  description: "Microservice e-commerce website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
      <ToastContainer position='top-left' />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
