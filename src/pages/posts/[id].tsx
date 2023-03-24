import Navbar from "@/not-app/navbar";
import Container from "@/ui/container";
import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import SuperJSON from "superjson";
import Image from "next/image";
import Footer from "@/sections/footer";
import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { BiDownvote, BiUpvote } from "react-icons/bi";
import { useRefresh } from "@/hooks/useRefresh";
import { FacebookShareButton, FacebookIcon, InstapaperShareButton, InstapaperIcon, TwitterShareButton, TwitterIcon } from "react-share";
import { useRouter } from "next/router";

type PostProps = {
  post: string;
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

export default function Post({ post }: PostProps) {
  const { id, title, content, votes, skills, ais, author } = SuperJSON.parse<any>(post);
  const [updatePost, { data, loading, error }] = useMutation(updateVoteMutation);
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
              <button> comment </button>
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

        </div>
      </div>
      <Footer/>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  let post = undefined;

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
        author: true,
      },
    });

    post.skills = post?.skills.map((skill: any) => skill.skill);
    post.ais = post?.ais.map((ai: any) => ai.ai);
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
