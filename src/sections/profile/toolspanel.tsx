import TabPanel from "@/components/globals/tabpanel";
import ToolCardAdmin from "@/components/tools/toolcardadmin";
import {
  Button,
  Container,
  Grid,
  Link,
} from "@mui/material";
import { Tool } from "@prisma/client";
import React from "react";

interface ToolPanelProps {
  tools: Tool[];
  index: number;
  value: number;
}

export default function ToolPanel({ tools, index, value }: ToolPanelProps) {
  return (
    <TabPanel index={index} value={value}>
      <Grid container className="py-4" spacing={4}>
        <Grid item container xs={8}>
          <Container className="flex flex-col gap-2">
            {tools.map((tool: Tool) => (
              <ToolCardAdmin key={tool.id} tool={tool} />
            ))}
          </Container>
        </Grid>
        <Grid item xs={4}>
          <Link href="/tools/create">
            <Button variant="contained"> Submit Your Tool </Button>
          </Link>
        </Grid>
      </Grid>
    </TabPanel>
  );
}
