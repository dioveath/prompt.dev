import TabPanel from '@/components/globals/tabpanel'
import ToolCardAdmin from '@/components/tools/toolcardadmin';
import { gql, useQuery } from '@apollo/client';
import { Button, CircularProgress, Container, Grid, Link, Typography } from '@mui/material'
import { Tool } from '@prisma/client';
import React from 'react'

const getToolsQuery = gql`
  query GetTools {
    tools {
      edges {
        node {
          id
          title
          description
          shortDescription
          website
          avatar
          published
          lastReleased
          createdAt
          updatedAt
        }
      }
    }
  }
`;

interface ToolsPanelAdminProps {
  index: number;
  value: number;
}

export default function ToolsPanelAdmin({ index, value }: ToolsPanelAdminProps) {
  const { data: toolsData, loading: toolsLoading, error: toolsError } = useQuery(getToolsQuery);
  const tools = toolsData?.tools.edges.map((edge: any) => edge.node);

  if (toolsLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    )
  }      

  return (
    <TabPanel value={index} index={value}>
      <Grid container className="py-4" spacing={4}>
        <Grid item container xs={12} md={8}>
          <Container className="flex flex-col gap-2">
            {tools.map((tool: Tool) => (
              <ToolCardAdmin key={tool.id} tool={tool} />
            ))}
          </Container>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button variant="contained" href='tools/create'> Submit Your Tool </Button>
        </Grid>
      </Grid>
    </TabPanel>
  )
}
