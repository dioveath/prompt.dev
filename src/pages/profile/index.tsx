import { Container, Button, Grid, Avatar, Box, Tabs, Tab, useTheme, Backdrop, CircularProgress, Typography } from '@mui/material';
import Navbar from '../../components/globals/navbar';
import { gql, useQuery } from "@apollo/client";
import PostPanel from '@/sections/profile/postspanel';
import { useState } from 'react';
import ToolPanel from '@/sections/profile/toolspanel';
import SettingsPanel from '@/sections/profile/settingspanel';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import SuperJSON from 'superjson';

const meQuery = gql`
  query {
    me {
      email
      name
      jobTitle
      email
      createdAt
      avatar
      posts {
        id
        title
        content
        votesCount
        createdAt
        tools {
          tool {
            id
            title
          }          
        }
      }
      authoredTools {
        id
        tool {
          id
          title
          avatar
          website
          shortDescription
          lastReleased
          published
        }
      }
    }
  }
`;

export default function Profile() {
  const { data, loading, error } = useQuery(meQuery);
  const [value, setValue] = useState(0);

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (loading && !data)
    return (
      <Backdrop sx={{ backgroundColor: "#121212", zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  if (error)
    return (
      <Backdrop sx={{ backgroundColor: "#121212", zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
        <Typography variant="h4">500 Error: {error.message}</Typography>
      </Backdrop>
    );  

  return (
    <>
    <Navbar path='/'/>
    <Container className='py-4'>
      <Grid container className={`flex-col justify-center items-center py-4 rounded-md ${isDark ? 'bg-gray-900' : 'bg-gray-200/80'}`}>
        <Avatar alt={`${data.me.name}'s Avatar`} src={data.me.avatar} className='w-20 h-20'/>        
        <h1 className="font-bold text-lg"> { data.me.name } </h1>
        <p>{data.me.jobTitle}</p>
        <p>{data.me.email}</p>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Posts" />
          <Tab label="Tools" />
          <Tab label="Settings"/>
        </Tabs>
      </Box>
      <PostPanel posts={data.me.posts} index={0} value={value}/>
      <ToolPanel tools={data.me.authoredTools.map((tool: any) => tool.tool)} index={1} value={value}/>
      <SettingsPanel userData={data.me} index={2} value={value}/>

    </Container>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context) => {
    const user = await getSession(context.req, context.res);
    if(!user) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
    return {
      props: {
      }
    }
  }
});