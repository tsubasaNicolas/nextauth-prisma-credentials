// RootLayout.jsx
"use client";
import { Inter as FontInter } from "next/font/google"; // Importa la fuente Inter
import { cn } from "@/lib/utils";
import Navbar from "../components/Navbar";
import "./globals.css";

// Define la fuente Inter
const fontInter = FontInter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>
          {`
            :root {
              ${fontInter.styles}
            }
          `}
        </style>
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontInter.variable
        )}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
