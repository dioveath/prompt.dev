import dynamic from "next/dynamic";
import ToolCard from "@/components/tools/toolcard";
import { gql, useQuery } from "@apollo/client";
import { Skill, Tool, User } from "@prisma/client";
import Link from "next/link";
import React from "react";

import { Backdrop, Button, CircularProgress, Container, Grid, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import PSelect from "@/components/globals/select";

const toolsQuery = gql`
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

const getSkillsQuery = gql`
  query {
    skills {
      id
      title
    }
  }
`;

export type ToolExtended = Tool & {
  toolAuthors: User[];
  toolUsers: User[];
};

const PAGE_SIZE = 10;

interface FilterProps {
  search?: string;
  category?: string;
  skills?: [];
}

export default function ExploreToolsSection() {
  const { data: skillsData, error: skillsError } = useQuery(getSkillsQuery);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FilterProps>({ defaultValues: { search: "", category: "" } });
  const { data, loading, error, fetchMore, refetch } = useQuery(toolsQuery, { variables: { first: PAGE_SIZE, orderBy: "createdAt", order: "desc", search: "", skills: [], published: true } });

  if (loading)
    return (
      <Grid container className="justify-center items-center">
        <CircularProgress color="inherit" />
      </Grid>
    );

  if (error)
    return (
      <Backdrop sx={{ backgroundColor: "#121212", zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
        <Typography variant="h4">500 Error: {error.message}</Typography>
      </Backdrop>
    );

  const { endCursor, hasNextPage } = data.tools.pageInfo;

  const onSubmit = async (data: FilterProps) => {
    const skills = data.skills?.map((skill: Skill) => skill.id);
    await refetch({ search: data.search, orderBy: "createdAt", order: "desc", skills: skills });
  };

  const loadMore = () => {
    fetchMore({
      variables: {
        after: endCursor,
        first: PAGE_SIZE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          tools: {
            ...fetchMoreResult.tools,
            edges: [...prev.tools.edges, ...fetchMoreResult.tools.edges],
          },
        };
      },
    });
  };

  return (
    <>
      <Container>
        <div className="flex flex-col items-center gap-1">
          <Typography variant="h4" className="font-semibold">
            Find all of favourite tools here.
          </Typography>
          <Typography variant="h6" className="">
            Be more productive.
          </Typography>
          <Typography variant="h6" className="">
            Take Competitive Advantage.{" "}
          </Typography>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <Grid container spacing={2} className="my-4 items-end">
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField
                {...register("search", { required: false })}
                variant="standard"
                placeholder="Search your tool... Enter keywords"
                helperText={errors.search?.message}
                error={!!errors.search?.message}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <PSelect
                    {...field}
                    options={skillsData?.skills}
                    isMulti={true}
                    placeholder="Filter skills"
                    getOptionLabel={(option: any) => option.title}
                    getOptionValue={(option: any) => option.id}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <Button variant="contained" color="primary" fullWidth size="large" type="submit">
                Search
              </Button>
            </Grid>
          </Grid>
        </form>

        <Grid container rowSpacing={2} columnSpacing={1} className="my-10">
          {data.tools.edges.length === 0 && (
            <Grid item xs={12} className="flex justify-center items-center">
              <Typography variant="h5" className="font-semibold">
                {" "}
                No tools found.{" "}
              </Typography>
            </Grid>
          )}

          {data &&
            data.tools.edges.map(({ node: tool }: { node: ToolExtended }) => (
              <Grid item xs={12} sm={7} md={5} lg={4} key={tool.id}>
                <Link href={`/tools/${tool.id}`} key={tool.id} className="no-underline flex-1">
                  <ToolCard tool={tool} />
                </Link>
              </Grid>
            ))}
        </Grid>

        <div className="flex justify-center items-center my-4">
          <Button onClick={loadMore} disabled={!hasNextPage}>
            Load More
          </Button>
        </div>
      </Container>
    </>
  );
}
