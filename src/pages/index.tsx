import React from "react";
import Navbar from "@/not-app/navbar";
import Hero from "@/not-app/hero";
import Search from "@/not-app/search";
import { Inter } from "next/font/google";
import ThreadsList from "@/sections/threads";
import Container from "@/ui/container";
import Footer from "@/sections/footer";

const inter = Inter({ subsets: ["latin"] });

const mockPosts = [
  {
    title: "Write a Job guarantied Cover letter for you Job Application.",
    content: "Let’s solve one of your gruesome problem while searching for your new Job. Yes, We’re talking about ‘Cover Letter’. The dreaded text that nobody knows who’s going to read and what they’re going to get from that except ‘I‘m the best candidate you could ever find’. Nonetheless, it has never been ceased off and it’s some kind of wor...",
    votes: 10,
  }
];

export default function Home() {
  return (
    <main className={`w-screen min-h-screen h-full ${inter.className}`}>
      <Navbar path="home" />
      <Hero />
      <Search />   
      <Container className="my-4">
        <ThreadsList/>
      </Container>
      <Footer/>
    </main>
  );
}
