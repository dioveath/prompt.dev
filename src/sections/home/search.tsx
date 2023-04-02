import { Button, Chip, Container, Grid, TextField } from "@mui/material";
import React from "react";

export default function SearchSection() {
  return (
    <Container>
      <Grid container direction="column" gap={2}>
        <Grid className="flex items-center gap-4">
          <TextField
            id="standard-search"
            label="Search Field"
            type="search"
            variant="standard"
            fullWidth
            multiline
          />
          <Button type="submit" variant="contained"> Search </Button>
        </Grid>
        {/* <Grid container className="gap-2">
          <Chip label="Ways to generate beautiful landscape"/>
          <Chip label="Content Writing tips" />
        </Grid> */}
      </Grid>
    </Container>
  );
}
