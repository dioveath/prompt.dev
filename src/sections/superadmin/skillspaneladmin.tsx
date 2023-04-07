import TabPanel from "@/components/globals/tabpanel";
import SkillCardAdmin from "@/components/superadmin/skillcardadmin";
import { gql, useQuery } from "@apollo/client";
import { Button, CircularProgress, Container, Grid } from "@mui/material";
import { Skill } from "@prisma/client";
import React from "react";

const getSkillsQuery = gql`
  query GetSkills {
    skills {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

interface SkillsPanelAdminProps {
  index: number;
  value: number;
}

export default function SkillsPanelAdmin({ index, value }: SkillsPanelAdminProps) {
  const { data: skillsData, loading: skillsLoading, error: skillsError } = useQuery(getSkillsQuery);
  const skills = skillsData?.skills;

  if (!skills) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <TabPanel value={index} index={value}>
      <Grid container className="py-4" spacing={4}>
        <Grid item container xs={12} md={8}>
          <Container className="flex flex-col gap-2">
            {skills.map((skill: Skill) => (
              <SkillCardAdmin key={skill.id} skill={skill} />
            ))}
          </Container>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button variant="contained" href="skills/create">
            Add Skill
          </Button>
        </Grid>
      </Grid>
    </TabPanel>
  );
}
