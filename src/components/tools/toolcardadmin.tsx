import { gql, useMutation } from "@apollo/client";
import { Avatar, Button, Card, CardActionArea, CardActions, Grid } from "@mui/material";
import React from "react";
import { MdDelete, MdPreview, MdShare } from "react-icons/md";

interface ToolCardAdminProps {
  tool: any;
}

const deleteMutationQuery = gql`
  mutation DeleteTool($id: ID!) {
    deleteTool(id: $id) {
      id
    }
  }
`;

export default function ToolCardAdmin({ tool }: ToolCardAdminProps) {
  const [deleteTool, { data, loading, error }] = useMutation(deleteMutationQuery);

  const handleDelete = async () => {
    await deleteTool({
      variables: {
        id: tool.id,
      },
    });
  };

  return (
    <Card key={tool.id} className="shadow-none">
      <Grid item xs={12} className="">
        <CardActionArea className="p-4 flex flex-row justify-between items-center" href={`tools/mutate/${tool.id}`}>
          <div className="flex gap-2">
            <div>
              <Avatar variant="square" alt={`${tool.title}'s Profile`} src={tool.avatar || undefined} className="w-16 h-16" />
            </div>
            <div>
              <h3>{tool.title}</h3>
              <p className="text-sm font-medium text-gray-500">{tool.shortDescription}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <p className="text-sm font-medium text-gray-500">
              {tool?.lastReleased ? new Date(parseInt(tool.lastReleased)).toDateString() : "No Release"}
            </p>
          </div>
        </CardActionArea>
        <CardActions className="gap-4">
          <Button size="small" startIcon={<MdShare />}> Share </Button>
          <Button size="small" startIcon={<MdPreview />} href={`/tools/${tool.id}`}> View </Button>          
          {/* <Button size="small" startIcon={<MdDelete />}> Delete </Button> */}
        </CardActions>
      </Grid>
    </Card>
  );
}
