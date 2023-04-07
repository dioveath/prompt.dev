import { gql, useMutation } from "@apollo/client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Avatar, Badge, Button, Card, CardActionArea, CardActions, Grid } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { MdPublish, MdPreview, MdShare, MdUnpublished } from "react-icons/md";

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

const publishToolMutationQuery = gql`
  mutation PublishTool($id: ID!) {
    publishTool(id: $id) {
      id
      published
      lastReleased
    }
  }
`;

export default function ToolCardAdmin({ tool }: ToolCardAdminProps) {
  const [deleteTool, { data, loading, error }] = useMutation(deleteMutationQuery);
  const [publishTool, { data: publishData, loading: publishLoading, error: publishError }] = useMutation(publishToolMutationQuery);
  const { user, isLoading: userLoading, error: userError } = useUser();


  const handleDelete = async () => {
    await deleteTool({
      variables: {
        id: tool.id,
      },
    });
  };

  const handlePublish = async () => {
    await toast.promise(
      publishTool({
        variables: {
          id: tool.id,
        },
      }),
      {
        loading: "UnPublishing Tool 🔃🔃🔃",
        success: "Tool UnPublished 🔻🔻🔻",
        error: "Error UnPublishing Tool 📛📛📛",
      }
    );
  };

  return (
    <Card key={tool.id} className="shadow-none">
      <Grid item xs={12} className="">
        <CardActionArea className="p-4 flex flex-row justify-between items-center relative" href={`tools/mutate/${tool.id}`}>
          <div className="flex gap-2">
            <div>
              <Avatar variant="square" alt={`${tool.title}'s Profile`} src={tool.avatar || undefined} className="w-16 h-16" />
            </div>
            <div>
              <h3>{tool.title}</h3>
              <p className="text-sm font-medium text-gray-500">{tool.shortDescription}</p>
            </div>
          </div>

          <Badge className={`h-2 w-2 absolute top-4 right-4 rounded-full ${tool.published ? "bg-green-500" : "bg-red-400"}`}/>
          <div className="flex items-center gap-1 ">
            <p className="text-sm font-medium text-gray-500">{tool?.lastReleased ? new Date(parseInt(tool.lastReleased)).toLocaleDateString() : "No Release"}</p>
          </div>
        </CardActionArea>
        <CardActions className="gap-4">
          <Button size="small" startIcon={<MdShare />}>Share</Button>
          <Button size="small" startIcon={<MdPreview />} href={`/tools/${tool.id}`}>View</Button>

          {/* We'll only allow unpublishing of tool, publishing will be done by superadmin only */}
          { (tool.published || user?.email === 'prompter.dev@gmail.com') && <Button size="small" startIcon={tool.published ? <MdUnpublished/> : <MdPublish />} onClick={handlePublish}> {tool.published ? "Unpublish" : "Publish"} </Button> }
          
        </CardActions>
      </Grid>
    </Card>
  );
}
