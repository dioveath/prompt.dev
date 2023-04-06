import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import React from "react";

export default function Footer() {
  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h5" className="font-bold">
              About
            </Typography>
            <Typography variant="body1">
              This is a place where you can find all the ai tools you need to build your next project. You can also add your own tools to the list.
            </Typography>
          </Grid>
          {/* <Grid item xs={12} sm={6} md={8} className="flex flex-col gap-4">
            <Typography variant="h5" className="font-bold">
              Contact
            </Typography>
            <TextField variant="filled" multiline rows={3} fullWidth></TextField>
            <Button variant="contained">Send Message</Button>
          </Grid> */}
        </Grid>
      </Container>
      <div className="w-full flex flex-col items-center justify-center divide-y-2 my-10">
        <div>
          Made with 🔥 in 🌋 by <a href="https://raisaroj360.com.np">@dioveath</a>
        </div>
        <div>&copy; 2022 - All Rights Reserved</div>
      </div>
    </>
  );
}
