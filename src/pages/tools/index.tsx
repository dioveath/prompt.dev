import ToolCard from "@/components/tools/toolcard";
import { gql, useQuery } from "@apollo/client";
import { Tool, User } from "@prisma/client";
import Link from "next/link";
import React from "react";

import Navbar from "@/components/globals/navbar";
import { Container } from "@mui/material";

const toolsQuery = gql`
  query {
    tools {
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
`;

export type ToolExtended = Tool & {
  toolAuthors: User[];
  toolUsers: User[];
};

export default function ToolsPage() {
  const { data, loading, error } = useQuery(toolsQuery);

  return (
    <>
    <Navbar path="/tools"/>
    <Container>
      <div className="text-lg font-semibold my-5"> Tools </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <div className="flex flex-wrap gap-4">
      {data &&
        data.tools.map((tool: ToolExtended) => (
          <Link href={`/tools/${tool.id}`} key={tool.id} className="no-underline flex-1">
            <ToolCard tool={tool}/>
          </Link>
        ))}
      </div>
      
    </Container>    
    </>

  );
}
