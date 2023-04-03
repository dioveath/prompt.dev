import { Container, Button, Grid, Avatar, Box, Tabs, Tab } from '@mui/material';
import Navbar from '../../components/globals/navbar';
import { gql, useQuery } from "@apollo/client";
import { Post } from "@prisma/client";
import Link from "next/link";
import TabPanel from '@/components/globals/tabpanel';
import PostPanel from '@/sections/profile/postspanel';
import { useState } from 'react';
import ToolPanel from '@/sections/profile/toolspanel';
import SettingsPanel from '@/sections/profile/settingspanel';

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
          shortDescription
          lastReleased
        }
      }
    }
  }
`;

export default function Profile() {
  const { data, loading, error } = useQuery(meQuery);
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
    <Navbar path='/'/>
    <Container className='py-4'>
      <Grid container className='flex-col justify-center items-center py-4 bg-gray-200 rounded-md'>
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