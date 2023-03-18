import React from "react";
import Navbar from "@/not-app/navbar";
import Hero from "@/not-app/hero";
import Search from "@/not-app/search";
import { Inter } from "next/font/google";
import { Button } from "@nextui-org/react";
import NavbarComponent from "@/components/globals/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`w-screen min-h-screen h-full ${inter.className}`}>
      <NavbarComponent/>
      {/* <Navbar path="home" />
      <Hero />
      <Search /> */}
      <Hero/>
      <Search/>
    </main>

  );
}
