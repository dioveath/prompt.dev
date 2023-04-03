import TabPanel from "@/components/globals/tabpanel";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  Container,
  Grid,
  Link,
} from "@mui/material";
import React, { useMemo } from "react";
import { TbArrowBigUpLinesFilled } from "react-icons/tb";

interface PostPanelProps {
  posts: [];
  index: number;
  value: number;
}

export default function PostPanel({ posts, index, value }: PostPanelProps) {

  return (
    <TabPanel index={index} value={value}>
      <Grid container className="py-4" spacing={4}>
        <Grid item container xs={8}>
          <Container className="flex flex-col gap-2">
            {posts.map((post: any) => (
              <Card key={post.id} className="shadow-none">
                <Grid item xs={12} className="">
                  <CardActionArea
                    className="p-4 flex flex-row justify-between items-center"
                    href={`posts/${post.id}`}
                  >
                    <div>
                        <h3>{post.title}</h3>
                        <p className="text-sm font-medium text-gray-500">{new Date(parseInt(post.createdAt)).toDateString()}</p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <p className="font-bold">{post.votesCount}</p>                        
                        <TbArrowBigUpLinesFilled className="text-2xl text-green-500 h-4 w-4"/>
                    </div>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary" href={`posts/mutate/${post.id}`}> Update </Button>
                  </CardActions>
                </Grid>
              </Card>
            ))}
          </Container>
        </Grid>
        <Grid item xs={4}>
          <Link href="/posts/create">
            <Button variant="contained"> Create new Post </Button>
          </Link>
        </Grid>
      </Grid>
    </TabPanel>
  );
}
