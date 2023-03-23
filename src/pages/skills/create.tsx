import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import Container from '@/ui/container';
import Button from '@/ui/button';
import { useMutation, useQuery } from '@apollo/client';
import toast from 'react-hot-toast';
import { gql } from '@apollo/client';

const createSkillQuery = gql`
    mutation($title: String!) {
        createSkill(title: $title) {
            title
        }
    }
`;

export default function CreateSkillPage() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [createSkill, { data, loading, error }] = useMutation(createSkillQuery);

    const onSubmit: SubmitHandler<any> = data => {
        const { title } = data;
        const variables = { title };
        try {
            toast.promise(createSkill({ variables }), {
                loading: 'Creating Skill 🔃🔃',
                success: 'Skill Created 🎉🎉',
                error: 'Error Creating Skill 😥😥'
            });
        } catch (error) {
            toast.error('Error Creating Skill 😥😥');
        }
    }

  return (
    <Container>
        <h1 className='text-lg font-bold' >Create Skill</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" {...register("title", { required: true })} className='bg-gray-300 py-2 px-4'/>
                {errors.title && <span>This field is required</span>}
            </div>
            <Button type="submit">Create Skill</Button>
        </form>
    </Container>
  )
}
