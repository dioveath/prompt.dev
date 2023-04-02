import React from "react";
import Navbar from "@/components/globals/navbar";
import Hero from "@/sections/home/hero";
import Search from "@/sections/home/search";
import { Inter } from "next/font/google";
import ThreadsList from "@/sections/threads";
import Footer from "@/sections/footer";
import { Container } from "@mui/material";


const inter = Inter({ subsets: ["latin"] });


export default function Home() {
  return (
    <main className={`w-screen min-h-screen h-full ${inter.className}`}>
      <Navbar path="/"/>
      <Hero />
      <Search /> 
      <Container className="my-10">
        <ThreadsList/>
      </Container>
      <Footer/>
    </main>
  );
}
