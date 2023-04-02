import React from "react";
import Navbar from "@/components/globals/navbar";
import Hero from "@/not-app/hero";
import Search from "@/not-app/search";
import { Inter } from "next/font/google";
import ThreadsList from "@/sections/threads";
import Container from "@/ui/container";
import Footer from "@/sections/footer";

const inter = Inter({ subsets: ["latin"] });


export default function Home() {
  return (
    <main className={`w-screen min-h-screen h-full ${inter.className}`}>
      <Navbar />
      <Hero />
      <Search />   
      <Container className="my-4">
        <ThreadsList/>
      </Container>
      <Footer/>
    </main>
  );
}
