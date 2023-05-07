import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";


export default function Footer() {
  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h5" className="font-bold">
              prompters.dev
            </Typography>
            <div className="h-2"></div>
            <a href="https://www.producthunt.com/posts/prompters-dev?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-prompters&#0045;dev" target="_blank">
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=388002&theme=dark"
                alt="prompters&#0046;dev - AI&#0032;tool&#0032;community&#0032;to&#0032;share&#0032;&#0038;&#0032;learn&#0032;AI&#0032;tools | Product Hunt"
                style={{width: "250px", height: "54px"}}
                width="250"
                height="54"
              />
            </a>
            <Typography variant="body1">
              This is a place where you can find all the ai tools you need to build your next big thing. You can also add your own tools to the list. Also you can join our community to get
              help from other AI prosumers.
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
