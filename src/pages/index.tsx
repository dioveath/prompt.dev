import React from "react";
import Navbar from "@/components/globals/navbar";
import Hero from "@/sections/home/hero";
import Footer from "@/sections/footer";
import { Container, Grid } from "@mui/material";
import ExploreToolsSection from "@/sections/tools/exploretools";
import TrendingToolsSection from "@/sections/home/trendingtools";


export default function Home() {
  return (
    <main>
      <Navbar path="/" />
      <Hero />
      <Container className="my-10">
        <Grid container>
          <Grid item xs={12} md={12}>
            <TrendingToolsSection />
          </Grid>
          <Grid item xs={12} md={12} height={100}></Grid>
          <Grid item xs={12} md={12}>
            <ExploreToolsSection />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </main>
  );
}
