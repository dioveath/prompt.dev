import React from "react";
import Container from "@/ui/container";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@/ui/button";
import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";

const createAIQuery = gql`
  mutation CreateAI($title: String!, $company: String!, $website: String!) {
    createAI(title: $title, company: $company, website: $website) {
      id
      title
      company
      website
    }
  }
`;

type CreateAIProps = {
  title: string;
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
  const [createAI, { data, loading, error }] = useMutation(createAIQuery);

  const onSubmit: SubmitHandler<CreateAIProps> = (data) => {
    const { title, company, website } = data;
    try { 
      toast.promise(createAI({ variables: { title, company, website } }), 
      {
        loading: 'Creating AI 🔃🔃🔃',
        success: 'AI created successfully! 🎉🎉🎉',
        error: 'Error creating AI 😢😢😢'
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
        <label htmlFor="company">Company</label>
        <input type="text" {...register("company", { required: true })} className="bg-gray-300 py-2 px-4"/>
        {errors.company && <span className="text-red-500 text-xs">This field is required</span>}
        <label htmlFor="website">Website</label>
        <input type="text" {...register("website", { required: true })} className="bg-gray-300 py-2 px-4"/>
        {errors.website && <span className="text-red-500 text-xs">This field is required</span>}
        <Button> Create AI </Button>
      </form>
    </Container>
  );
}
