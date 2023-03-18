"use client";
import { Inter } from "next/font/google";
import Navbar from "./navbar";
import Hero from "./hero";
import Search from "./search";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Providers>
      <main className={`w-screen min-h-screen h-full ${inter.className}`}>
        <Navbar path="home" />
        <Hero />
        <Search />
      </main>
    </Providers>
  );
}
