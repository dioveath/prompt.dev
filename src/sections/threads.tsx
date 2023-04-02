import React from 'react'
import PostCard from '@/components/globals/postcard'
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Grid } from '@mui/material';

const postsQuery = gql`
  query {
    posts {
      id
      title
      content
      votesCount
      meVoted
      skills {
        skill {
          id
          title
        }
      }
      ais {
        ai {
          id
          title
        }
      }
      tools {
        tool {
          id
          title
        }
      }
    }
  }
`

export default function ThreadsList() {
  const { data, loading, error } = useQuery(postsQuery);  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const curatedPosts = data.posts.map((post: any) => {
    const { skills, ais, tools } = post;
    const curatedSkills = skills.map((skill: any) => skill.skill);
    const curatedAis = ais.map((ai: any) => ai.ai);
    const curatedTools = tools.map((tool: any) => tool.tool);
    return {
      ...post,
      skills: curatedSkills,
      ais: curatedAis,
      tools: curatedTools
    }
  })
  
  return (
    <Grid container className='gap-4'>
      { curatedPosts.map((post: any) => <PostCard key={post.id} {...post} />) }
    </Grid>    
  )
}