import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import React, { useMemo } from "react";
import { toast } from "react-hot-toast";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { SlBadge } from "react-icons/sl";
import { GiRobotHelmet } from "react-icons/gi";
import Chip from "./chip";


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

  const summary = useMemo(() => {
    const parsedContent = JSON.parse(content);
    let summary = "";
    parsedContent.forEach((node: any) => {
      if (node.type === "paragraph") {
        summary += node.children[0].text;
      }
    });
    return summary.length >= 496 ? summary.substring(0, 496) + "..." : summary;
  }, [content]);

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
  };

  return (
      <div className="w-full flex justify-between cursor-pointer shadow-lg rounded-lg overflow-clip">
        <div className="flex flex-col items-center bg-gray-200 py-4 px-6">
          <BiUpvote
            className="text-2xl hover:text-green-500"
            onClick={() => onVote(VoteType.UPVOTE)}
          />
          <p className="text-sm font-bold"> {votes} </p>
          <BiDownvote
            className="text-2xl hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onVote(VoteType.DOWNVOTE)
             }}
          />
        </div>
        <Link href={`posts/${id}`} className="flex-1 py-2 px-2">
          <p className="font-bold text-2xl mb-1"> {title} </p>
          <p className="leading-4 text-ellipses"> {summary} </p>
          <div className="flex gap-4">
            <div>
              <p className="font-semibold mb-1"> Skills </p>
              <ul className="flex gap-2">
                {skills.map((skill: any) => (
                  <Chip key={skill.id} label={skill.title} intent="primary" icon={<SlBadge color="yellow"/>}/>
                ))}
              </ul>
            </div>
            
            <div>
              <p className="font-semibold mb-1"> AIs </p>
              <ul className="flex gap-2">
                {ais.map((ai: any) => (
                  <Chip key={ai.id} label={ai.title} intent="secondary" icon={<GiRobotHelmet/>}/>
                ))}
              </ul>
            </div>
            
          </div>
        </Link>
      </div>
  );
}
