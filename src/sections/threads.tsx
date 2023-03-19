import React from 'react'
import PostCard from '@/components/globals/postcard'
import Container from '@/ui/container';

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

export default function ThreadsList() {
  return (
    <div className='flex flex-wrap gap-2'>
      { mockPosts.map((post, index) => <PostCard key={index} {...post} />) }    
    </div>
  )
}
