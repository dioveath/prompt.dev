import { gql, useMutation } from "@apollo/client";
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { Skill } from "@prisma/client";
import React from "react";
import toast from "react-hot-toast";
import apolloClient from "../../../lib/apollo";

interface SkillCardAdminProps {
  skill: Skill;
}

const useDeleteSkillMutation = gql`
  mutation DeleteSkill($id: ID!) {
    deleteSkill(id: $id) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export default function SkillCardAdmin({ skill }: SkillCardAdminProps) {
  const [deleteSkill] = useMutation(useDeleteSkillMutation);

  const handleDelete = async () => {
    await toast.promise(
      deleteSkill({
        variables: {
          id: skill.id,
        },
      }),
      {
        loading: "Deleting Skill",
        success: "Skill Deleted",
        error: "Error Deleting Skill",
      }
    );
    apolloClient.refetchQueries({ include: ["GetSkills"]});
  };

  return (
    <Card key={skill.id}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {skill.title}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href={`/skills/${skill.id}`}>
          Edit
        </Button>
        <Button size="small" onClick={handleDelete}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
