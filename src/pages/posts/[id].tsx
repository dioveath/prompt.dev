import Navbar from "@/components/globals/navbar";
import Container from "@/ui/container";
import { GetServerSideProps } from "next";
import React, { useEffect, useMemo, useState } from "react";
import SuperJSON from "superjson";
import Footer from "@/sections/footer";
import { gql, useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import { TbArrowBigUpLines, TbArrowBigUpLinesFilled } from "react-icons/tb";

import Button from "@mui/material/Button";

import { FacebookShareButton, FacebookIcon, InstapaperShareButton, InstapaperIcon, TwitterShareButton, TwitterIcon } from "react-share";
import CommentCard from "@/components/posts/comment";
import { Comment } from "@prisma/client";
import AddComment from "@/components/posts/add_comment";

import SlateView from "@/sections/posts/slateview";
import { Avatar, Box, Typography } from "@mui/material";
import SEOHead from "@/components/seo";
import { useUser } from "@auth0/nextjs-auth0/client";

type PostProps = {
  post: string;
};

type CommentExtended = Comment & {
  author: { name: string; avatar: string };
  post: { id: string };
};

const getPostCommentsQuery = gql`
  query ($id: ID!) {
    post(id: $id) {
      id
      votesCount
      meVoted
      comments {
        id
        content
        author {
          id
          name
          avatar
        }
        post {
          id
        }
        replies {
          id
        }
        createdAt
        updatedAt
      }
    }
  }
`;

const updateVoteMutation = gql`
  mutation ($id: ID!) {
    updatePostVote(id: $id) {
      id
      votesCount
      meVoted
    }
  }
`;

const CommentContext = React.createContext<any>({});
export const useCommentContext = () => React.useContext<any>(CommentContext);
export type { CommentExtended };

const URL = "https://prompters.dev";

export default function Post({ post: postJSON }: PostProps) {
  const post = SuperJSON.parse<any>(postJSON);
  const { id, title, content, skills, ais, tools, votesCount: propVoteCount, author } = post;
  const [updatePost, { data, loading, error }] = useMutation(updateVoteMutation);
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const [rootComments, setRootComments] = useState<CommentExtended[]>([]);
  const [groupComments, setGroupComments] = useState<any>({});
  const { data: queryData, loading: getPostLoading, error: getPostError } = useQuery(getPostCommentsQuery, { variables: { id: id } });
  const { votesCount, meVoted } = queryData?.post || { votesCount: propVoteCount, meVoted: false };

  const { user, isLoading: userLoading, error: errorLoading } = useUser();

  useEffect(() => {
    if (!queryData) return;

    const mappedComments: any = {};
    const comments = queryData.post.comments;

    comments.forEach((comment: any) => {
      mappedComments[comment.id] = comment;
    });

    const groupComments: any = {};
    let rootComments: any = queryData.post.comments;

    comments.forEach((comment: any) => {
      const replies = comment.replies.map((reply: any) => mappedComments[reply.id]);
      rootComments = rootComments.filter((rootComment: any) => {
        return replies.filter((reply: any) => reply.id === rootComment.id).length === 0;
      });
      groupComments[comment.id] = [...replies];
    });

    setGroupComments(groupComments);
    setRootComments(rootComments);
  }, [queryData]);

  const onVote = async () => {
    if (!user) return toast.error("You must be logged in to vote");
    try {
      const updatedPost = await toast.promise(updatePost({ variables: { id: id } }), {
        loading: "Updating Votes 🔃🔃",
        success: "Votes Updated! 🎉",
        error: "Error Updating Votes 😥😥, from promise" + error,
      });
    } catch (error) {
      toast.error("Error Updating Votes 😥😥");
    }
  };

  return (
    <Container>
      <SEOHead {...post} image={"assets/background.png"} currentUrl={`${URL}/posts/${post.slug}`} />
      <Navbar path="/posts" />
      <div className="flex flex-col items-center min-h-screen py-2">
        <Box className="flex flex-col items-center justify-start w-full px-6 md:px-10 lg:px-20 py-8 lg:py-16 rounded-lg shadow-xl gap-4">
          <div className="w-full flex items-center justify-start gap-2">
            <Avatar alt={`${author?.name} Profile`} src={author?.avatar}/>
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <article className="text-sm text-gray-500">{author?.name}</article>
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
            <div className="flex flex-row gap-2">
              {tools?.map((tool: any) => (
                <p key={tool.id} className="text-xs text-white bg-blue-500 px-2 py-1 rounded-full">
                  {tool.title}
                </p>
              ))}
            </div>
          </div>

          <div className="w-full">
            <SlateView content={content} />
          </div>

          <div className="w-full flex justify-between items-center gap-4">
            <div onClick={onVote} className="flex flex-row items-center gap-2 cursor-pointer">
              {meVoted ? <TbArrowBigUpLinesFilled className="text-2xl text-green-500" /> : <TbArrowBigUpLines className="text-2xl hover:text-green-500" />}
              <Typography variant="body2">{votesCount}</Typography>
            </div>
            <div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (!user) return toast.error("You must be logged in to comment");
                  setFormOpen(true);
                }}
              >
                Comment
              </Button>
            </div>

            <div className="flex gap-2">
              <FacebookShareButton
                url={`${URL}/posts/${post.slug}`}
                quote={title}
                hashtag={[tools?.map((tool: any) => "#" + tool.title), skills?.map((skill: any) => "#" + skill.title), ais?.map((ai: any) => "#" + ai.title)].join(" ")}
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={`${URL}/posts/${post.slug}`}
                title={title}
                hashtags={[skills?.map((skill: any) => skill.title), ais?.map((ai: any) => ai.title), tools?.map((tool: any) => tool.title)]}
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            </div>
          </div>

          <div className="w-full flex flex-col justify-start">
            <h1 className="text-2xl font-bold my-4">Comments</h1>
            <div className="w-full flex flex-col gap-4">
              <CommentContext.Provider value={{ groupComments }}>
                {formOpen && <AddComment comment={{ postId: id }} setFormOpen={setFormOpen} />}
                {rootComments?.map((comment: any) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))}
              </CommentContext.Provider>
            </div>
          </div>
        </Box>
      </div>
      <Footer />
    </Container>
  );
}

function isValid(id: string | undefined) {
  if (!id) return false;
  // simply match the id from regular expression
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return true;
  } else {
    return false;
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  let post: any = undefined;

  if (!params?.id) return { notFound: true };

  let id = params?.id?.toString();
  let where: any = { id: id };
  if (isValid(id)) {
    const post = await prisma.post.findUnique({ where: { id: id } });
    if (!post) return { notFound: true };
    if (post.slug) {
      return {
        redirect: {
          destination: `/posts/${post.slug}`,
          permanent: true,
        },
      };
    }
  } else {
    where = { slug: id };
  }

  try {
    post = await prisma.post.findUnique({
      where: where,
      include: {
        _count: { select: { votes: true } },
        skills: {
          include: {
            skill: true,
          },
        },
        votes: true,
        ais: {
          include: {
            ai: true,
          },
        },
        tools: {
          include: {
            tool: true,
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
    post.tools = post?.tools.map((tool: any) => tool.tool);
    post.votesCount = post._count.votes;
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
