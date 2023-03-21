import { Post } from "@prisma/client";
import React from "react";
import { BiUpvote, BiDownvote } from "react-icons/bi";

export default function PostCard(props: Post) {
  const { title, content, votes } = props;

  return (
    <div className="w-full flex justify-between cursor-pointer">
      <div className="flex flex-col items-center bg-gray-200 py-4 px-6">
        <BiUpvote className="text-2xl hover:text-green-500" onClick={() => { console.log("upvoted!") }}/>
        <p className="text-sm font-bold"> { votes } </p>
        <BiDownvote className="text-2xl hover:text-red-500" onClick={() => { console.log('downvote') }}/>
      </div>                  
      <div className="flex-1 border-2 border-l-transparent border-black py-2 px-2">
        <p className="font-bold text-2xl mb-1"> { title } </p>
        <p className="leading-4"> { content } </p>
      </div>
    </div>
  );
}
