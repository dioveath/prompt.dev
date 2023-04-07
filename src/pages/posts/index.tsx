import React from "react";
import PostCard from "@/components/globals/postcard";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Backdrop, Button, CircularProgress, Container, Drawer, Grid, TablePagination, Typography } from "@mui/material";
import Navbar from "@/components/globals/navbar";
import Footer from "@/sections/footer";
import { useUser } from "@auth0/nextjs-auth0/client";

const postsQuery = gql`
  query allPostsQuery($first: Int, $after: ID) {
    posts(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          content
          votesCount
          meVoted
          skills {
            skill {
              id
              title
            }
          }
          ais {
            ai {
              id
              title
            }
          }
          tools {
            tool {
              id
              title
            }
          }
        }
      }
    }
  }
`;

const PAGE_SIZE = 10;

export default function ThreadsList() {
  const { data, loading, error, fetchMore } = useQuery(postsQuery, { variables: { first: PAGE_SIZE } });
  const { user, isLoading: userLoading, error: errorLoading } = useUser();
  const [open, setOpen] = React.useState(!!user);

  if (loading)
    return (
      <Backdrop sx={{ backgroundColor: "#efefef22", zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  if (error)
    return (
      <Backdrop sx={{ backgroundColor: "#efefef", zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
        <Typography variant="h4">500 Error: {error.message}</Typography>
      </Backdrop>
    );

  const { endCursor, hasNextPage } = data.posts.pageInfo;

  const curatedPosts = data.posts.edges.map((edge: any) => {
    const post: any = edge.node;
    const { skills, ais, tools } = post;
    const curatedSkills = skills.map((skill: any) => skill.skill);
    const curatedAis = ais.map((ai: any) => ai.ai);
    const curatedTools = tools.map((tool: any) => tool.tool);
    return {
      ...post,
      skills: curatedSkills,
      ais: curatedAis,
      tools: curatedTools,
    };
  });

  const loadMore = () => {
    fetchMore({
      variables: { after: endCursor, first: PAGE_SIZE },
      updateQuery: (prev, { fetchMoreResult }) => {
        fetchMoreResult.posts.edges = [...prev.posts.edges, ...fetchMoreResult.posts.edges];
        return fetchMoreResult;
      },
    });
  };

  return (
    <>
      <Navbar path="/posts" />
      <Container>
        <Typography variant="h5" className="my-4">
          Latest Posts
        </Typography>

        <Grid container className="gap-4">
          {curatedPosts?.map((post: any) => (
            <PostCard key={post.id} {...post} />
          ))}
        </Grid>

        <div className="my-4 flex justify-center items-center">
          <Button variant="contained" onClick={loadMore} disabled={!hasNextPage}>
            Load More
          </Button>
        </div>

        <div className={`fixed left-0 bottom-0 bg-gray-800/80 w-full shadow-lg ${!open ? "hidden" : ""}` }>
          <Container sx={{ padding: "40px 0px", backgroundColor: "transparent", position: "relative" }}>
            <Button sx={{ position: "absolute", top: "10px", right: "10px", fontSize: "20px", fontWeight: "900", color: "white" }} onClick={() => setOpen(false)}> X </Button>
            <Typography variant="h5" className="mb-4 text-white">
              Login to join the discussion
            </Typography>

            <div className="flex gap-5">
              <Button variant="contained" href="/api/auth/login">
                Login
              </Button>
              <Button variant="contained" color="secondary" href="/api/auth/login">
                Sign Up
              </Button>
            </div>
          </Container>
        </div>
        <Footer />
      </Container>
    </>
  );
}
