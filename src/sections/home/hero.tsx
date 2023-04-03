import { Button, Container, Grid, Typography } from "@mui/material";
import React from "react";

export default function HeroSection() {
  return (
    <Container className="my-20">
      <Grid container direction={'column'} className="justify-center items-center gap-4">
        <Grid item xs={8}>
          <Typography variant="h1" className="text-center font-semibold text-[50px]">
            Get yourself to be more productive with AI
          </Typography>
          <Typography variant="h5" className="text-center mt-4">
            Learn to work with an AI. The next big skill of new
            generation.
          </Typography>
        </Grid>
        <Button size="large" variant="contained" href="/tools" className="shadow-md"> Explore Tools </Button>
      </Grid>
      
    </Container>
  );
}
