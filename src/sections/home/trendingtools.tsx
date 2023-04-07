import ToolCard from "@/components/tools/toolcard";
import { ToolExtended } from "@/pages/tools";
import { gql, useQuery } from "@apollo/client";
import { Grid, Link, Skeleton, Typography } from "@mui/material";
import React from "react";

const getToolsQuery = gql`
  query ($first: Int, $after: ID, $orderBy: String, $order: String, $search: String, $skills: [ID!], $published: Boolean) {
    tools(first: $first, after: $after, orderBy: $orderBy, order: $order, search: $search, skills: $skills, published: $published) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          website
          avatar
          shortDescription
          description
          views
          toolAuthors {
            id
            author {
              name
            }
          }
        }
      }
    }
  }
`;

const PAGE_SIZE = 3;

export default function TrendingToolsSection() {
  const { data, loading, error, fetchMore } = useQuery(getToolsQuery, { variables: { first: PAGE_SIZE, orderBy: "views", order: "desc", published: true } });

  return (
    <>
      <div>
        <Typography variant="h4"> Trending Tools </Typography>
        <Typography variant="h6"> Tools that are trending in the community </Typography>
      </div>

      <Grid container rowSpacing={5} columnSpacing={1} className="my-5" justifyContent={"center"}>
        {loading && (
          <>
            {[0, 1, 2].map((i) => (
              <React.Fragment key={i}>
                <Grid item container xs={12} sm={7} md={5} lg={4} justifyContent={"center"}>
                  <Skeleton key={i} variant="rectangular" width={320} height={300} />
                </Grid>
              </React.Fragment>
            ))}
          </>
        )}

        {data && data.tools.edges.length === 0 && (
          <Grid item xs={12} className="flex justify-center items-center">
            <Typography variant="h5" className="font-semibold">
              No tools found.
            </Typography>
          </Grid>
        )}

        {data &&
          data.tools.edges.map(({ node: tool }: { node: ToolExtended }) => (
            <Grid item container xs={12} sm={7} md={5} lg={4} key={tool.id} justifyContent={"center"}>
              <Link href={`/tools/${tool.id}`} key={tool.id} className="no-underline">
                <ToolCard tool={tool} />
              </Link>
            </Grid>
          ))}
      </Grid>
    </>
  );
}
