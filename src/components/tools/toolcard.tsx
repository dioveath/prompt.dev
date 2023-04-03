import { ToolExtended } from "@/pages/tools";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";

type ToolCardProps = {
  tool: ToolExtended;
};

export default function ToolCard({ tool: { title, shortDescription, avatar } }: ToolCardProps) {
  return (
    <Card sx={{ width: 345 }} className="shadow-sm">
      <CardMedia
        component="img"
        alt={`${title} logo`}
        height="180"
        image={avatar || '/assets/artificial-intelligence.png'}
        sx={(avatar ? { objectFit: "cover" } : { objectFit: "contain", padding: "2rem", backgroundColor: "#aaaaaa55" })}
      />
      <CardContent className="h-36">
        <Typography gutterBottom variant="h5" component="div" className="underline">
          { title }
        </Typography>
        <Typography variant="body2" color="text.secondary">
          { shortDescription }
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}