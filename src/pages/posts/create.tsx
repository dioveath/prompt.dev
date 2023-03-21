import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import Container from '@/ui/container';
import Button from '@/ui/button';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { gql } from '@apollo/client';

const createPostQuery = gql`
    mutation($title: String!, $content: String!) {
        createPost(title: $title, content: $content) {
            title
            content
        }
    }
`;


type CreatePostProps = {
    title: string;
    content: string;
};

export default function CreatePost() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreatePostProps>();
  const [createPost, { data, loading, error }] = useMutation(createPostQuery);

  const onSubmit: SubmitHandler<CreatePostProps> = data => {
    const { title, content } = data;
    const variables = { title, content };
    try {
      toast.promise(createPost({ variables }), {
        loading: 'Creating Post 🔃🔃',
        success: 'Post Created 🎉🎉',
        error: 'Error Creating Post 😥😥'
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
            <Button type="submit"> Create Post </Button>
        </form>
    </Container>
  )
}