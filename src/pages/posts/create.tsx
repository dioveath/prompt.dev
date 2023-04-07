import React from 'react'
import { useMutation, useQuery } from '@apollo/client';
import toast from 'react-hot-toast';
import { gql } from '@apollo/client';

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Container, Button } from '@mui/material';

import dynamic from 'next/dynamic';
import Navbar from '@/components/globals/navbar';
import { TextField } from '@mui/material';
import PSelect from '@/components/globals/select';

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
    skills?: [];
    ais?: [];
    tools?: [];
};

type UpdatePostProps = {
    post: any;
}

export default function CreatePost({ post } : UpdatePostProps) {
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm<CreatePostProps>();
  const [createPost, { data, loading, error }] = useMutation(createPostQuery);
  const { data: skillsData, loading: skillsLoading, error: skillsError } = useQuery(getSkillsQuery);
  const { data: aiData, loading: aiLoading, error: aiError } = useQuery(getAIsQuery);
  const { data: toolData, loading: toolLoading, error: toolError } = useQuery(getToolsQuery);

  const onSubmit: SubmitHandler<CreatePostProps> = data => {
    const { title, skills, ais, tools } = data;

    const content = localStorage.getItem('content');
    const variables = { 
        title, 
        content,
        skills: skills?.map((skill: any) => skill.id), 
        ais: ais?.map((ai: any) => ai.id), 
        tools: tools?.map((tool: any) => tool.id)
    };

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
    <>
    <Navbar path='/posts'/>
    <Container className='py-4'>
        <h1 className='text-2xl font-bold'>Create Post</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
            
            <label htmlFor="content" className='text-lg font-semibold mt-4'> Title </label>            
            <TextField { ...register("title", { required: true })} label='Title' variant='filled' size='medium' rows={1} multiline/>
            {errors.title && <span className='text-xs text-red-500'>This field is required</span>}

            <label htmlFor="content" className='text-lg font-semibold mt-4'> Post Content </label>
            <Container>
                <SlateEditor initialValue={post?.content}/>
            </Container>
            
            <label htmlFor="skills" className='text-lg font-semibold mt-4'> Skills </label>
            <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                    <PSelect
                        {...field}
                        options={skillsData?.skills}
                        isMulti={true}
                        getOptionLabel={(option: any) => option.title }
                        getOptionValue={(option: any) => option.id}
                    />
                )}
            />

            <label htmlFor="ais" className='text-lg font-semibold mt-4'> AIs </label>
            <Controller
                name="ais"
                control={control}
                render={({ field }) => (
                    <PSelect
                        {...field}
                        options={aiData?.ais}
                        isMulti={true}
                        getOptionLabel={(option: any) => option.title }
                        getOptionValue={(option: any) => option.id}
                    />
                )}
            />

            <label htmlFor="tools" className='text-lg font-semibold mt-4'> Tools </label>
            <Controller
                name="tools"
                control={control}
                render={({ field }) => (
                    <PSelect
                        {...field}
                        options={toolData?.tools}
                        isMulti={true}
                        getOptionLabel={(option: any) => option.title }
                        getOptionValue={(option: any) => option.id}
                    />
                )}
            />

            <Button type="submit" variant='contained'> Create Post </Button>
        </form>
    </Container>    
    </>
  )
}