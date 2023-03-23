import React from 'react'
import PostCard from '@/components/globals/postcard'
import Container from '@/ui/container';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Post } from '@prisma/client';

const mockPosts = [
  {
    title: "Write a Job guarantied Cover letter for you Job Application.",
    content: "Let’s solve one of your gruesome problem while searching for your new Job. Yes, We’re talking about ‘Cover Letter’. The dreaded text that nobody knows who’s going to read and what they’re going to get from that except ‘I‘m the best candidate you could ever find’. Nonetheless, it has never been ceased off and it’s some kind of wor...",
    votes: 10,
  },
  {
    title: "Write a Job guarantied Cover letter for you Job Application.",
    content: "Let’s solve one of your gruesome problem while searching for your new Job. Yes, We’re talking about ‘Cover Letter’. The dreaded text that nobody knows who’s going to read and what they’re going to get from that except ‘I‘m the best candidate you could ever find’. Nonetheless, it has never been ceased off and it’s some kind of wor...",
    votes: 10,
  },
  {
    title: "Write a Job guarantied Cover letter for you Job Application.",
    content: "Let’s solve one of your gruesome problem while searching for your new Job. Yes, We’re talking about ‘Cover Letter’. The dreaded text that nobody knows who’s going to read and what they’re going to get from that except ‘I‘m the best candidate you could ever find’. Nonetheless, it has never been ceased off and it’s some kind of wor...",
    votes: 10,
  }    
];

const postsQuery = gql`
  query {
    posts {
      id
      title
      content
      votes
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
    }
  }
`

export default function ThreadsList() {
  const { data, loading, error } = useQuery(postsQuery);  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const curatedPosts = data.posts.map((post: any) => {
    const { skills, ais } = post;
    const curatedSkills = skills.map((skill: any) => skill.skill);
    const curatedAis = ais.map((ai: any) => ai.ai);
    return {
      ...post,
      skills: curatedSkills,
      ais: curatedAis
    }
  })
  

  return (
    <div className='flex flex-wrap gap-2'>
      { curatedPosts.map((post: any) => <PostCard key={post.id} {...post} />) }
    </div>
  )
}
