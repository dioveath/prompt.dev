import React from "react";
import Container from "@/ui/container";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@/ui/button";
import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";

const createAICategoryQuery = gql`
  mutation CreateAICategory($title: String!) {
    createAICategory(title: $title) {
      id
      title
    }
  }
`;

type CreateAIProps = {
  title: string;
  description: string;
  company: string;
  website: string;
};

export default function CreateAIPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateAIProps>();
  const [createAI, { data, loading, error }] = useMutation(createAICategoryQuery);
  
  const onSubmit: SubmitHandler<CreateAIProps> = (data) => {
    const { title } = data;
    try { 
      toast.promise(createAI({ variables: { title } }), 
      {
        loading: 'Creating AI Category 🔃🔃🔃',
        success: 'AI Category created successfully! 🎉🎉🎉',
        error: 'Error creating AI Category 😢😢😢' + error
      });
    } catch(error) {
      toast.error('Error creating AI 😢😢😢');
    }
    
  }

  return (
    <Container>
      <h1>Create AI</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <label htmlFor="title">Title</label>
        <input type="text" {...register("title", { required: true })} className="bg-gray-300 py-2 px-4"/>
        {errors.title && <span className="text-red-500 text-xs">This field is required</span>}
        <Button type="submit"> Create AI </Button>
      </form>
    </Container>
  );
}