import React from "react";
import Container from "@/ui/container";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@/ui/button";
import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";

const createAICategoryQuery = gql`
  mutation CreateTool($title: String!, $description: String, $shortDescription: String, $avatar: String, $website: String!) {
    createTool(title: $title, description: $description, shortDescription: $shortDescription, avatar: $avatar, website: $website) {
      id
      title
      toolAuthors {
        id
        author { 
            name
        }
      }
    }
  }
`;

type CreateToolProps = {
  title: string;
  shortDescription?: string;
  description?: string;
  avatar?: string;
  categoryId?: string;
  website: string;
};

export default function CreateAIPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateToolProps>();
  const [createAI, { data, loading, error }] = useMutation(createAICategoryQuery);
  
  const onSubmit: SubmitHandler<CreateToolProps> = (data) => {
    const { title, shortDescription, description, avatar, website } = data;
    try { 
      toast.promise(createAI({ variables: { title, shortDescription, description, avatar, website } }), 
      {
        loading: 'Creating AI Tool 🔃🔃🔃',
        success: 'AI Tool created successfully! 🎉🎉🎉',
        error: 'Error creating AI Tool 😢😢😢' + error
      });
      console.log(data);
    } catch(error) {
      toast.error('Error creating AI Tool😢😢😢');
    }
    
  }

  return (
    <Container>
      <h1 className="font-bold text-2xl">Create AI Tool </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <label htmlFor="title">Title</label>
        <input type="text" {...register("title", { required: true })} className="bg-gray-300 py-2 px-4"/>
        { errors.title && <span className="text-red-500 text-xs"> { errors.title.message } </span>}

        <label htmlFor="shortDescription">Short Description</label>
        <input type="text" {...register("shortDescription")} className="bg-gray-300 py-2 px-4"/>
        { errors.shortDescription && <span className="text-red-500 text-xs"> { errors.shortDescription.message }</span>}

        <label htmlFor="description">Description</label>
        <input type="text" {...register("description")} className="bg-gray-300 py-2 px-4"/>
        { errors.description && <span className="text-red-500 text-xs"> { errors.description.message }</span>}

        <label htmlFor="website">Website</label>
        <input type="text" {...register("website", { required: true })} className="bg-gray-300 py-2 px-4"/>
        { errors.website && <span className="text-red-500 text-xs"> { errors.website.message }</span>}

        <Button type="submit"> Submit Tool </Button>
      </form>
    </Container>
  );
}