import React from "react";
import PostCard from "@/components/globals/postcard";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Backdrop, Button, CircularProgress, Grid, TablePagination, Typography } from "@mui/material";

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

const PAGE_SIZE = 6;

export default function ThreadsList() {
  const { data, loading, error, fetchMore } = useQuery(postsQuery, { variables: { first: PAGE_SIZE } });

  if (loading)
    return (
      <Backdrop sx={{ backgroundColor: "#efefef", zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
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
      <Typography variant="h4" className="my-4">
        Latest Posts
      </Typography>

      <Grid container className="gap-4">
        {curatedPosts?.map((post: any) => (
          <PostCard key={post.id} {...post} />
        ))}
      </Grid>

      {/* <Button variant="contained" onClick={loadMore} disabled={!hasNextPage}> Load More </Button> */}
    </>
  );
}
