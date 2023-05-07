import React from "react";
import dynamic from "next/dynamic";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import prisma from "../../../../lib/prisma";
import { gql, useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import Navbar from "@/components/globals/navbar";
import { Container, Button, TextField, Grid } from "@mui/material";
const Select = dynamic(import("react-select"), { ssr: false });
import Footer from "@/sections/footer";
import SuperJSON from "superjson";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AI, Skill, Tool, ToolCategory, User } from "@prisma/client";
import PSelect from "@/components/globals/select";

const updateToolMutation = gql`
  mutation UpdateTool(
    $id: ID!, 
    $title: String, 
    $shortDescription: String,     
    $description: String, 
    $avatar: String,
    $website: String, 
    $category: ID    
    $ais: [ID!], 
    $skills: [ID!], 
  ) {
    updateTool(
      id: $id, 
      title: $title, 
      description: $description, 
      shortDescription: $shortDescription, 
      avatar: $avatar, 
      website: $website, 
      category: $category      
      ais: $ais, 
      skills: $skills, 
    ) {
      id
      title
    }
  }
`;

const aisQuery = gql`
  query {
    ais {
      id
      title
      avatar
    }
  }
`;

const skillsQuery = gql`
  query {
    skills {
      id
      title
      avatar
    }
  }
`;

const toolCategoryQuery = gql`
  query {
    toolCategories {
      id
      title
    }
  }
`;

type MutateToolProps = {
  title: string;
  shortDescription?: string;
  description?: string;
  avatar?: string;
  category?: ToolCategory;
  website: string;
  ais?: AI[];
  skills?: Skill[];
  toolAuthors?: User[];
};

interface MutateToolPageProps {
  tool: string;
}

export default function MutateToolPage({ tool: toolJSON }: MutateToolPageProps) {
  const tool = SuperJSON.parse<Tool & { ais: [], skills: [], toolAuthors: [], category: ToolCategory}>(toolJSON);
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MutateToolProps>();
  const [updateTool, { data, loading, error }] = useMutation(updateToolMutation);
  const { data: aisData, loading: aisLoading, error: aisError } = useQuery(aisQuery);
  const { data: skillsData, loading: skillsLoading, error: skillsError } = useQuery(skillsQuery);
  const { data: toolCategoryData, loading: toolCategoryLoading, error: toolCategoryError } = useQuery(toolCategoryQuery);

  const { id, title, shortDescription, description, avatar, website, category, ais, skills, toolAuthors } = tool;  

  const onSubmit: SubmitHandler<MutateToolProps> = async (data) => {
    const { title, shortDescription, description, avatar, website, category, ais, skills } = data;
    try {
      await toast.promise(updateTool({ variables: { 
        id, title, shortDescription, description, avatar, website, category: category?.id, 
        ais: ais?.map((ai: AI) => ai.id), skills: skills?.map((skill: Skill) => skill.id) } }), {
        loading: "Updating AI Tool 🔃🔃🔃",
        success: "AI Tool updating successfully! 🎉🎉🎉",
        error: "Error updating AI Tool 😢😢😢" + error,
      });
    } catch (error) {
      toast.error("Error updating AI Tool😢😢😢");
    }
  };

  return (
    <>
      <Navbar path="/tools" />
      <Container>
        <Grid container className="my-4">
          <Grid item xs={12} justifyContent={"center"}>
            <h1 className="font-bold text-2xl my-4">Update <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 ">{title}</span> Tool</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2  ">
              <label htmlFor="title">Title</label>
              <TextField type="text" {...register("title", { required: "Title is required" })} variant="filled" multiline rows={1} defaultValue={title} helperText={errors.title?.message} error={!!errors.title}/>

              <label htmlFor="shortDescription">Short Description</label>
              <TextField type="text" {...register("shortDescription", { required: "Short Description is required", maxLength: { value: 64, message: "Can't be more than 64 chars"} })} variant="filled" multiline rows={2} defaultValue={shortDescription} helperText={errors.shortDescription?.message} error={!!errors.shortDescription} />

              <label htmlFor="description">Description</label>
              <TextField type="text" {...register("description", { required: "Description is required", maxLength: { value: 2048, message: "Can't be more than 2048 chars" } })} variant="filled" multiline rows={4} defaultValue={description} helperText={errors.description?.message} error={!!errors.description}/>

              <Grid container spacing={4}>
                <Grid item xs={12} lg={6} className="flex flex-col gap-2">
                  <label htmlFor="website">Website</label>
                  <TextField type="text" {...register("website", { required: "Website is required" })} variant="filled" multiline maxRows={1} defaultValue={website} helperText={errors.website?.message} error={!!errors.website}/>

                  <label htmlFor="avatar">Avatar</label>
                  <TextField type="text" {...register("avatar")} variant="filled" multiline maxRows={1} defaultValue={avatar} helperText={errors.avatar?.message} error={!!errors.avatar}/>
                </Grid>

                <Grid item xs={12} lg={6} className="flex flex-col gap-2">
                  <label htmlFor="ais" className="text-lg font-semibold mt-4">
                    AIs
                  </label>
                  <Controller
                    name="ais"
                    control={control}
                    render={({ field }) => (
                      <PSelect
                        {...field}
                        options={aisData?.ais}
                        isMulti={true}
                        getOptionLabel={(option: any) => option.title}
                        getOptionValue={(option: any) => option.id}
                        defaultValue={ais?.map((ai: any) => ai.ai)}
                      />
                    )}
                  />

                  <label htmlFor="skills" className="text-lg font-semibold mt-4">
                    Skills
                  </label>
                  <Controller
                    name="skills"
                    control={control}
                    render={({ field }) => (
                      <PSelect
                        {...field}
                        options={skillsData?.skills}
                        isMulti={true}
                        getOptionLabel={(option: any) => option.title}
                        getOptionValue={(option: any) => option.id}
                        defaultValue={skills?.map((skill: any) => skill.skill)}
                      />
                    )}
                  />

                  <label htmlFor="toolCategories" className="text-lg font-semibold mt-4">
                    Tool Categories
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <PSelect
                        {...field}
                        options={toolCategoryData?.toolCategories}
                        getOptionLabel={(option: any) => option.title}
                        getOptionValue={(option: any) => option.id}
                        defaultValue={category}                  
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Button type="submit" variant="contained">
                Update Tool
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context: any) => {
    const { id } = context.params;
    if(!id) return { redirect: { destination: "/tools", permanent: false } };

    const user = await getSession(context.req, context.res);
    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const tool = await prisma.tool.findUnique({
      where: {
        id: id?.toString(),
      },
      include: {
        ais: {
          include: {
            ai: true,
          },
        },
        skills: {
          include: {
            skill: true,
          },
        },
        toolAuthors: { include: { author: true } },
        category: true,
      },
    });

    const userFromDB = await prisma.user.findUnique({
      where: {
        email: user.user.email,
      },
    });

    if (!tool)
      return {
        notFound: true,
      };

    if (!tool.toolAuthors.some((author) => author.authorId === userFromDB?.id) && userFromDB?.email !== "prompter.dev@gmail.com") {
      return {
        redirect: {
          destination: "/tools",
          permanent: false,
        },
      };
    }

    return {
      props: {
        tool: SuperJSON.stringify(tool),
      },
    };
  },
});
