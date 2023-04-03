import TabPanel from "@/components/globals/tabpanel";
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  Container,
  Grid,
  Link,
} from "@mui/material";
import React from "react";

interface ToolPanelProps {
  tools: [];
  index: number;
  value: number;
}

export default function ToolPanel({ tools, index, value }: ToolPanelProps) {
  return (
    <TabPanel index={index} value={value}>
      <Grid container className="py-4" spacing={4}>
        <Grid item container xs={8}>
          <Container className="flex flex-col gap-2">
            {tools.map((tool: any) => (
              <Card key={tool.id} className="shadow-none">
                <Grid item xs={12} className="">
                  <CardActionArea
                    className="p-4 flex flex-row justify-between items-center"
                    href={`tools/${tool.id}`}
                  >
                    <div className="flex gap-2">
                      <div>
                        <Avatar
                          variant="square"
                          alt={`${tool.title}'s Profile`}
                          src={tool.avatar}
                          className="w-16 h-16"
                        />
                      </div>
                      <div>
                        <h3>{tool.title}</h3>
                        <p className="text-sm font-medium text-gray-500">
                          {tool.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium text-gray-500">
                        {new Date(parseInt(tool.lastReleased)).toDateString()}
                      </p>
                    </div>
                  </CardActionArea>
                </Grid>
              </Card>
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
