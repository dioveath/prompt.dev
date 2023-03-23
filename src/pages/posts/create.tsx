import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import Container from '@/ui/container';
import Button from '@/ui/button';
import { useMutation, useQuery } from '@apollo/client';
import toast from 'react-hot-toast';
import { gql } from '@apollo/client';

const createPostQuery = gql`
    mutation($title: String!, $content: String!, $skills: [ID!], $ais: [ID!]) {
        createPost(title: $title, content: $content, skills: $skills, ais: $ais) {
            title
            content
            skills
            ais
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

type CreatePostProps = {
    title: string;
    content: string;
    skills?: string[];
    ais?: string[];
};

export default function CreatePost() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreatePostProps>();
  const [createPost, { data, loading, error }] = useMutation(createPostQuery);
  const { data: skillsData, loading: skillsLoading, error: skillsError } = useQuery(getSkillsQuery);
  const { data: aiData, loading: aiLoading, error: aiError } = useQuery(getAIsQuery);

  const onSubmit: SubmitHandler<CreatePostProps> = data => {
    const { title, content } = data;
    const variables = { title, content, skills: data.skills, ais: data.ais};

    try {
      toast.promise(createPost({ variables }), {
        loading: 'Creating Post 🔃🔃',
        success: 'Post Created 🎉🎉',
        error: 'Error Creating Post 😥😥, from promise'
      });
    } catch (error) {
      toast.error('Error Creating Post 😥😥');
    }
  };

  return (
    <Container>
        <h1 className='text-2xl font-bold'>Create Post</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
            <input {...register("title", { required: true })} className='bg-gray-300 py-2 px-4'/>
            {errors.title && <span className='text-xs text-red-500'>This field is required</span>}
            <input {...register("content", { required: true })} className='bg-gray-300 py-2 px-4'/>
            {errors.content && <span className='text-xs text-red-500'>This field is required</span>}
            <select {...register("skills")} className='bg-gray-300 py-2 px-4'>
                <option value="">Select a skill</option>
                {skillsData?.skills.map((skill: any) => (
                    <option key={skill.id} value={skill.id}>{skill.title}</option>
                ))}
            </select>
            <select {...register("ais")} className='bg-gray-300 py-2 px-4'>
                <option value="">Select an AI</option>
                {aiData?.ais.map((ai: any) => (
                    <option key={ai.id} value={ai.id}>{ai.title}</option>
                ))}
            </select>
            <Button type="submit"> Create Post </Button>
        </form>
    </Container>
  )
}