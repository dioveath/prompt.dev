import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import { gql } from "@apollo/client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Container from "@/ui/container";
import Button from "@/ui/button";

import dynamic from "next/dynamic";
import SuperJSON from "superjson";
import { AI, Post, Skill, SkillsOnPosts, Tool } from "@prisma/client";

const Select = dynamic(import("react-select"), { ssr: false });
const SlateEditor = dynamic(import("@/sections/posts/slateeditor"), {
  ssr: false,
});

const updatePostQuery = gql`
  mutation ($id: ID!, $title: String, $content: String, $skills: [ID!], $ais: [ID!], $tools: [ID!]) {
    updatePost(id: $id, title: $title, content: $content, skills: $skills, ais: $ais, tools: $tools) {
      title
      content
    }
  }
`;

const getSkillsQuery = gql`
  query {
    skills {
      id
      title
    }
  }
`;

const getAIsQuery = gql`
  query {
    ais {
      id
      title
    }
  }
`;

const getToolsQuery = gql`
    query {
        tools {
            id
            title
        }
    }
`;

type CreatePostProps = {
  title: string;
  content: string;
  skills?: Skill[];
  ais?: AI[];
  tools?: Tool[];
};

type UpdatePostProps = {
  post: string;
};

export default function CreatePost({ post: postJSON }: UpdatePostProps) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreatePostProps>();
  const [updatePost, { data, loading, error }] = useMutation(updatePostQuery);
  const {
    data: skillsData,
    loading: skillsLoading,
    error: skillsError,
  } = useQuery(getSkillsQuery);
  const {
    data: aiData,
    loading: aiLoading,
    error: aiError,
  } = useQuery(getAIsQuery);
  const {
    data: toolsData,
    loading: toolsLoading,
    error: toolsError,
    } = useQuery(getToolsQuery);  

  const post = SuperJSON.parse<Post & { skills: Skill[], ais: AI[], tools: Tool[]}>(postJSON);

  const onSubmit: SubmitHandler<CreatePostProps> = (data) => {
    const { title, skills, ais, tools } = data;

    const content = localStorage.getItem("content");
    const variables = {
      id: post.id,
      title,
      content,
      skills: skills?.map((skill: any) => skill.id),
      ais: ais?.map((ai: any) => ai.id),
      tools: tools?.map((tool: any) => tool.id),
    };

    try {
      toast.promise(updatePost({ variables }), {
        loading: "Creating Post 🔃🔃",
        success: "Post Updated 🎉🎉",
        error: "Error Creating Post 😥😥, from promise" + error,
      });
    } catch (error) {
      toast.error("Error Creating Post 😥😥");
    }
  };

  return (
    <Container>
      <h1 className="text-2xl font-bold">Create Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <input
          {...register("title", { required: true, value: post?.title })}
          className="bg-gray-300 py-2 px-4"
        />
        {errors.title && (
          <span className="text-xs text-red-500"> { errors.title.message } </span>
        )}

        <SlateEditor initialValue={post?.content} />

        {/* <input {...register("content", { required: true })} className='bg-gray-300 py-2 px-4'/>
            {errors.content && <span className='text-xs text-red-500'>This field is required</span>} */}

        <Controller
          name="skills"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={skillsData?.skills}
              isMulti={true}
              getOptionLabel={(option: any) => option.title}
              getOptionValue={(option: any) => option.id}
            defaultValue={post?.skills.map((skill: any) => skill.skill)}
            />
          )}
        />

        <Controller
          name="ais"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={aiData?.ais}
              isMulti={true}
              getOptionLabel={(option: any) => option.title}
              getOptionValue={(option: any) => option.id}
              defaultValue={post?.ais.map((ai: any) => ai.ai)}
            />
          )}
        />

        <Controller
            name="tools"
            control={control}
            render={({ field }) => (
                <Select
                    {...field}
                    options={toolsData?.tools}
                    isMulti={true}
                    getOptionLabel={(option: any) => option.title}
                    getOptionValue={(option: any) => option.id}
                    defaultValue={post?.tools.map((tool: any) => tool.tool)}
                />
            )}
        />

        <Button type="submit"> Update Post </Button>
      </form>
    </Container>
  );
}

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;

  const post = await prisma.post.findUnique({
    where: {
      id: id?.toString(),
    },
    include: {
        skills: {
            include: { skill: true }
        },
        ais: { 
            include: { ai: true } 
        },
        tools: {
            include: { tool: true }
        }
    }
  });

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
