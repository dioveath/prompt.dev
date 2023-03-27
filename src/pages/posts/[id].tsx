import Navbar from "@/not-app/navbar";
import Container from "@/ui/container";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import SuperJSON from "superjson";
import Image from "next/image";
import Footer from "@/sections/footer";
import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { BiDownvote, BiUpvote } from "react-icons/bi";
import { useRefresh } from "@/hooks/useRefresh";
import { FacebookShareButton, FacebookIcon, InstapaperShareButton, InstapaperIcon, TwitterShareButton, TwitterIcon } from "react-share";
import CommentCard from "@/components/posts/comment";
import { Comment } from "@prisma/client";
import AddComment from "@/components/posts/add_comment";
import Button from "@/ui/button";

type PostProps = {
  post: string;
};

type CommentExtended = Comment & {
  author: { name: string; avatar: string };
  post: { id: string };
};

const updateVoteMutation = gql`
  mutation($id: ID!, $votes: Int!) {
    updatePostVote(id: $id, votes: $votes){
      id
      title
      votes
    }
  }
`;

enum VoteType {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
}


const CommentContext = React.createContext<any>({});
export const useCommentContext = () => React.useContext<any>(CommentContext);
export type { CommentExtended };


export default function Post({ post }: PostProps) {
  const { id, title, content, votes, skills, ais, author, comments, groupComments } = SuperJSON.parse<any>(post);
  const [updatePost, { data, loading, error }] = useMutation(updateVoteMutation);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const refresh = useRefresh();

  const onVote = async (voteType: VoteType) => {
    let newVotes = votes;
    if(voteType === VoteType.UPVOTE) {
      newVotes++;
    } else {
      newVotes--;
    }

    try {
      await toast.promise(updatePost({ variables: { id: id, votes: newVotes } }), {
        loading: "Updating Votes 🔃🔃",
        success: "Votes Updated! 🎉",
        error: "Error Updating Votes 😥😥, from promise" + error,
      });

      refresh();
    } catch (error){
      toast.error("Error Updating Votes 😥😥");
    }
  };

  return (
    <Container>
      <Navbar path="post" />
      <div className="flex flex-col items-center min-h-screen py-2">
        <div className="flex flex-col items-center justify-start w-full bg-white p-6 rounded-lg shadow-xl gap-4">
          <div className="w-full flex items-center justify-start gap-2">
            <Image alt={`${author?.name} Profile`} src={author?.avatar}
              className="rounded-full"
              width={"40"}
              height={"40"}
            />
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-sm text-gray-500">{author?.name}</p>
            </div>
          </div>
          <div className="w-full flex justify-start items-center gap-4">
              <div className="flex flex-row gap-2">
                {skills?.map((skill: any) => (
                  <p key={skill.id} className="text-xs text-white bg-purple-500 px-2 py-1 rounded-full">
                    {skill.title}
                  </p>
                ))}
              </div>
              <div className="flex flex-row gap-2">
                {ais?.map((ai: any) => (
                  <p key={ai.id} className="text-xs text-white bg-green-500 px-2 py-1 rounded-full">
                    {ai.title}
                  </p>
                ))}
              </div>
          </div>

          <div className="w-full">
            <p className="text-sm text-left">{content}</p>
          </div>

          <div className="w-full flex justify-between items-center gap-4">
            <div className="flex flex-row gap-2">
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
            <div>
              <button onClick={(e) => setFormOpen(true)}> Comment </button>
            </div>

            <div className="flex gap-2">
              <FacebookShareButton
                url={`https://charichainstitute.com.np/blog/VMw8hIk37JPMQTEHiKai`}
                quote={title}
                hashtag="#AI"
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={`https://charichainstitute.com.np/blog/VMw8hIk37JPMQTEHiKai`}
                title={title}
                hashtags={["AI"]}
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <InstapaperShareButton
                url={`https://charichainstitute.com.np/blog/VMw8hIk37JPMQTEHiKai`}
                title={title}
              >
                <InstapaperIcon size={32} round />
              </InstapaperShareButton>
            </div>
          </div>

          <div className="w-full flex flex-col justify-start">
            <h1 className="text-2xl font-bold my-4">Comments</h1>
            <div className="w-full flex flex-col gap-4">
              { formOpen && <AddComment comment={{ postId: id }} setFormOpen={setFormOpen} /> }              
              <CommentContext.Provider value={{ groupComments }} >
                {comments?.map((comment: any) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))}
              </CommentContext.Provider>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  let post: any = undefined;

  try {
    post = await prisma.post.findUnique({
      where: {
        id: params?.id?.toString(),
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        ais: {
          include: {
            ai: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: true,
          },
        },
        author: true,
      },
    });

    post.skills = post?.skills.map((skill: any) => skill.skill);
    post.ais = post?.ais.map((ai: any) => ai.ai);

    // group comments by parent
    const comments = post?.comments.reduce((acc: any, comment: any) => {
      const parent = comment.parentId || "root";
      acc[parent] = acc[parent] || [];
      acc[parent].push(comment);
      return acc;      
    }, {});

    post.comments = post?.comments.filter((comment: any) => !comment.parentId);
    post.groupComments = comments;

  } catch (error) {
    console.log(error);
  }

  if (!post)
    return {
      notFound: true,
    };

  return {
    props: {
      post: SuperJSON.stringify(post),
    },
  };
};
