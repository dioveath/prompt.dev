import React from "react";
import { BiUpvote, BiDownvote } from "react-icons/bi";

interface PostCardProps {
  title: string;
  content: string;
  votes: number;
}

export default function PostCard(props: PostCardProps) {
  const { title, content, votes } = props;
  
  return (
    <div className="flex justify-between cursor-pointer">
      <div className="flex flex-col items-center bg-gray-200 py-4 px-6">
        <BiUpvote className="text-2xl hover:text-green-500" onClick={() => { console.log("upvoted!") }}/>
        <p className="text-sm font-bold"> { votes } </p>
        <BiDownvote className="text-2xl hover:text-red-500" onClick={() => { console.log('downvote') }}/>
      </div>                  
      <div className="flex-1 border-2 border-l-transparent border-black py-2 px-2">
        <p className="font-bold text-2xl mb-1"> Write a Job guarantied Cover letter for you Job Application. </p>
        <p className="leading-4"> Let’s solve one of your gruesome problem while searching for your new Job. Yes, We’re talking about ‘Cover Letter’. The dreaded text that nobody knows who’s going to read and what they’re going to get from that except ‘I‘m the best candidate you could ever find’. Nonetheless, it has never been ceased off and it’s some kind of wor... </p>
      </div>
    </div>
  );
}
