import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import React, { useMemo } from "react";
import { toast } from "react-hot-toast";
import { TbArrowBigUpLines, TbArrowBigUpLinesFilled } from "react-icons/tb";
import { SlBadge } from "react-icons/sl";
import { GiRobotHelmet } from "react-icons/gi";
import Chip from "./chip";
import { Card, Container, Typography } from "@mui/material";


const updateVoteMutation = gql`
  mutation($id: ID!) {
    updatePostVote(id: $id){
      id
      title
      votesCount
      meVoted
    }
  }
`;

type PostCardProps = {
  id: number;
  title: string;
  content: string;
  votesCount: number;
  meVoted: boolean;
  skills: [];
  ais: [];
  tools: [];
};

export default function PostCard(props: PostCardProps) {
  const { id, title, content, votesCount, meVoted, skills, ais, tools } = props;
  const [updatePost, { data, loading, error }] = useMutation(updateVoteMutation);

  const summary = useMemo(() => {
    const parsedContent = JSON.parse(content);
    let summary = "";
    parsedContent.forEach((node: any) => {
      if (node.type === "paragraph") {
        summary += " " + node.children[0].text;
      }
    });
    return summary.length >= 96 ? summary.substring(0, 96) + "..." : summary;
  }, [content]);

   const onVote = () => {
    try {
      toast.promise(updatePost({ variables: { id: id } }), {
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
          <div onClick={onVote} className="flex flex-col items-center gap-1">
          { meVoted ? 
          <TbArrowBigUpLinesFilled className="text-2xl text-green-500"/>
          : <TbArrowBigUpLines className="text-2xl hover:text-green-500"/> }
          <p className={"text-sm font-bold " + (meVoted ? "text-green-500" : "text-black")}> {votesCount} </p>
          </div>
        </div>
        <Link href={`posts/${id}`} className="flex-1 py-2 px-4 no-underline">
          <Typography variant="h6" className="font-bold text-2xl mb-1 text-black"> {title} </Typography>
          <Typography variant="body1" className="text-black"> {summary} </Typography>
          <div className="flex gap-4">
            <div>
              <Typography variant="body1" className="font-semibold mb-1"> Tools </Typography>
              <ul className="flex gap-2">
                { tools.map((tool: any) => (
                  <Chip key={tool.id} label={tool.title} intent="primary" icon={<SlBadge color="green"/>}/>
                ))}
              </ul>
            </div>
            
            <div>
              <Typography variant="body1" className="font-semibold mb-1"> Skills </Typography>
              <ul className="flex gap-2">
                {skills.map((skill: any) => (
                  <Chip key={skill.id} label={skill.title} intent="primary" icon={<SlBadge color="yellow"/>}/>
                ))}
              </ul>
            </div>
            
            <div>
              <Typography variant="body1" className="font-semibold mb-1"> AI </Typography>
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
