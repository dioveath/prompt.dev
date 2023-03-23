import { gql, useMutation, useQuery } from "@apollo/client";
import { Post } from "@prisma/client";
import React from "react";
import { toast } from "react-hot-toast";
import { BiUpvote, BiDownvote } from "react-icons/bi";


const updateVoteMutation = gql`
  mutation($id: ID!, $votes: Int!) {
    updatePostVote(id: $id, votes: $votes){
      id
      title
      votes
    }
  }
`;

type PostCardProps = {
  id: number;
  title: string;
  content: string;
  votes: number;
  skills: [];
  ais: [];
};

enum VoteType {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
}

export default function PostCard(props: PostCardProps) {
  const { id, title, content, votes, skills, ais } = props;
  const [updatePost, { data, loading, error }] = useMutation(updateVoteMutation);

   const onVote = (voteType: VoteType) => {
    let newVotes = votes;
    if(voteType === VoteType.UPVOTE) {
      newVotes++;
    } else {
      newVotes--;
    }
    
    try {
      toast.promise(updatePost({ variables: { id: id, votes: newVotes } }), {
        loading: "Updating Votes 🔃🔃",
        success: "Votes Updated! 🎉",
        error: "Error Updating Votes 😥😥, from promise" + error,
      });
    } catch (error){
      toast.error("Error Updating Votes 😥😥");
    }
    console.log("upvoted!");
  };

  return (
    <div className="w-full flex justify-between cursor-pointer">
      <div className="flex flex-col items-center bg-gray-200 py-4 px-6">
        <BiUpvote
          className="text-2xl hover:text-green-500"
          onClick={() => onVote(VoteType.UPVOTE)}
        />
        <p className="text-sm font-bold"> {votes} </p>
        <BiDownvote
          className="text-2xl hover:text-red-500"
          onClick={() => onVote(VoteType.DOWNVOTE) }
        />
      </div>
      <div className="flex-1 border-2 border-l-transparent border-black py-2 px-2">
        <p className="font-bold text-2xl mb-1"> {title} </p>
        <p className="leading-4"> {content} </p>
        <div>
          <p className="font-semibold mb-1"> Skills </p>
          <ul className="flex gap-2">
            {skills.map((skill: any) => (
              <li key={skill.id} className='text-xs mb-0 px-4 bg-purple-500 text-white'> {skill.title} </li>
            ))}
          </ul>
          <p className="font-semibold mb-1"> AIs </p>
          <ul className="flex gap-2">
            {ais.map((ai: any) => (
              <li key={ai.id} className='text-xs mb-0 px-4 bg-purple-500 text-white'> {ai.title} </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
