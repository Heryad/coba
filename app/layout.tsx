import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { DataProvider } from "./context/DataProvider";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import Toast from "./components/Toast";
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coba T-Shirts",
  description: "Your brand description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <DataProvider>
                <CartProvider>
                  <Navbar />
                  {children}
                  <Footer />
                  <Toast />
                </CartProvider>
              </DataProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
