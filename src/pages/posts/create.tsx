import React from 'react'
import { useMutation, useQuery } from '@apollo/client';
import toast from 'react-hot-toast';
import { gql } from '@apollo/client';

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Container from '@/ui/container';
import Button from '@/ui/button';

import dynamic from 'next/dynamic';

const Select = dynamic(import('react-select'), { ssr: false });
const SlateEditor = dynamic(import('@/sections/posts/slateeditor'), { ssr: false });


const createPostQuery = gql`
    mutation($title: String!, $content: String!, $skills: [ID!], $ais: [ID!]) {
        createPost(title: $title, content: $content, skills: $skills, ais: $ais) {
            title
            content
            skills {
                id
            },
            ais {
                id
            }
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
    skills?: [];
    ais?: [];
};

export default function CreatePost() {
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm<CreatePostProps>();
  const [createPost, { data, loading, error }] = useMutation(createPostQuery);
  const { data: skillsData, loading: skillsLoading, error: skillsError } = useQuery(getSkillsQuery);
  const { data: aiData, loading: aiLoading, error: aiError } = useQuery(getAIsQuery);

  const onSubmit: SubmitHandler<CreatePostProps> = data => {
    const { title, skills, ais } = data;

    const content = localStorage.getItem('content');
    const variables = { title, content, skills: skills?.map((skill: any) => skill.id), ais: ais?.map((ai: any) => ai.id)};

    try {
      toast.promise(createPost({ variables }), {
        loading: 'Creating Post 🔃🔃',
        success: 'Post Created 🎉🎉',
        error: 'Error Creating Post 😥😥, from promise' + error
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

            <SlateEditor/>

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
                        getOptionLabel={(option: any) => option.title }
                        getOptionValue={(option: any) => option.id}
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
                        getOptionLabel={(option: any) => option.title }
                        getOptionValue={(option: any) => option.id}
                    />
                )}
            />

            <Button type="submit"> Create Post </Button>
        </form>
    </Container>
  )
}