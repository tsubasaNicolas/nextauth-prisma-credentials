// RootLayout.jsx
"use client";
import { Inter as FontInter } from "next/font/google"; // Importa la fuente Inter

import Navbar from "../components/Navbar";
import "./globals.css";
import { cn } from "../lib/utils.js";

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
