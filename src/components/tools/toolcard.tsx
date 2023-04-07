import { ToolExtended } from "@/pages/tools";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import React from "react";
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from "react-share";

type ToolCardProps = {
  tool: ToolExtended;
};

const URL = "https://www.prompters.dev";

export default function ToolCard({ tool: { id, title, shortDescription, avatar } }: ToolCardProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Card sx={{ width: { xs: 300, md: 340 } }} className="shadow-sm">
      <CardMedia
        component="img"
        alt={`${title} logo`}
        height="150"
        image={avatar || "/assets/artificial-intelligence.png"}
        sx={avatar ? { objectFit: "cover" } : { objectFit: "contain", padding: "2rem", backgroundColor: "#aaaaaa55" }}
      />
      <CardContent className="h-36">
        <Typography gutterBottom variant="h5" component="div" className="underline">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {shortDescription}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen(true);
          }}
        >
          Share
        </Button>
        <Button size="small">Learn More</Button>
        <Dialog open={open}>
          <DialogTitle> Share </DialogTitle>
          <DialogContent>
            <Typography variant="body2">Share this tool with your friends!</Typography>
            <FacebookShareButton url={`${URL}/tools/${id}`} quote={title} hashtag={`#${title}`}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={`${URL}/tools/${id}`} title={title} hashtags={[`#${title}`]}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </CardActions>
    </Card>
  );
}
