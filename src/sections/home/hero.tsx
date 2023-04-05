import { Button, Container, Grid, Typography } from "@mui/material";
import React from "react";

export default function HeroSection() {
  return (
    <div className="relative">

    {/* <img src="assets/background.png" alt="hero" className="absolute top-0 left-0 w-full h-full object-cover bg-black/50" /> */}
    <Container className="py-10">
      
      <Grid container direction={'column'} className="justify-center items-center gap-4">
        
        <Grid item xs={8} zIndex={1}>
          <Typography variant="h1" className="text-center font-semibold text-[50px] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Get yourself to be more productive with AI
          </Typography>
          <Typography variant="h5" className="text-center mt-4">
            Learn to work with an AI. The next big skill of new
            generation.
          </Typography>
        </Grid>
        <Button size="large" variant="contained" href="/posts" className="shadow-md"> Explore </Button>
      </Grid>
      
    </Container>
    </div>    
  );
}
