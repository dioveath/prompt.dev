import Navbar from "@/components/globals/navbar";
import SkillsPanelAdmin from "@/sections/superadmin/skillspaneladmin";
import ToolsPanelAdmin from "@/sections/superadmin/toolspaneladmin";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import React from "react";

interface SumperAdminProps {}

export default function SuperAdmin(props: SumperAdminProps) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Navbar path="/" />
      <Container>
        <Typography variant="h4" className="font-bold">
          Super Admin Panel
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Users" />
            <Tab label="Posts" />
            <Tab label="Tools" />
            <Tab label="Skills" />
            <Tab label="AIs" />
            <Tab label="ToolCategory" />
          </Tabs>
        </Box>

        <ToolsPanelAdmin index={2} value={value} />
        <SkillsPanelAdmin index={3} value={value} />

        {/* <ToolCategoriesPanelAdmin /> */}
      </Container>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context) => {
    const session = await getSession(context.req, context.res);
    if (!session || session.user.email !== "prompter.dev@gmail.com") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  },
});
