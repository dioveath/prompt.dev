import React from "react";
import dynamic from "next/dynamic";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { gql, useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import Navbar from "@/components/globals/navbar";
import { Container, Button, TextField, Grid } from "@mui/material";
const Select = dynamic(import("react-select"), { ssr: false });
import Footer from "@/sections/footer";
import SuperJSON from "superjson";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AI, Skill, Tool, ToolCategory, User } from "@prisma/client";

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
        loading: "Creating AI Tool 🔃🔃🔃",
        success: "AI Tool created successfully! 🎉🎉🎉",
        error: "Error creating AI Tool 😢😢😢" + error,
      });
    } catch (error) {
      toast.error("Error creating AI Tool😢😢😢");
    }
  };

  return (
    <>
      <Navbar path="/tools" />
      <Container>
        <Grid container className="my-4">
          <Grid item xs={12} justifyContent={"center"}>
            <h1 className="font-bold text-2xl my-4">Submit cool AI Tool </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2  ">
              <label htmlFor="title">Title</label>
              <TextField type="text" {...register("title", { required: true })} variant="filled" multiline maxRows={1} defaultValue={title}/>
              {errors.title && <span className="text-red-500 text-xs"> {errors.title.message} </span>}

              <label htmlFor="shortDescription">Short Description</label>
              <TextField type="text" {...register("shortDescription")} variant="filled" multiline rows={2} defaultValue={shortDescription}/>
              {errors.shortDescription && <span className="text-red-500 text-xs"> {errors.shortDescription.message}</span>}

              <label htmlFor="description">Description</label>
              <TextField type="text" {...register("description")} variant="filled" multiline rows={4} defaultValue={description}/>
              {errors.description && <span className="text-red-500 text-xs"> {errors.description.message}</span>}

              <Grid container spacing={4}>
                <Grid item xs={12} lg={6} className="flex flex-col gap-2">
                  <label htmlFor="website">Website</label>
                  <TextField type="text" {...register("website", { required: true })} variant="filled" multiline maxRows={1} defaultValue={website}/>
                  {errors.website && <span className="text-red-500 text-xs"> {errors.website.message}</span>}

                  <label htmlFor="avatar">Avatar</label>
                  <TextField type="text" {...register("avatar")} variant="filled" multiline maxRows={1} defaultValue={avatar}/>
                  {errors.avatar && <span className="text-red-500 text-xs"> {errors.avatar.message}</span>}
                </Grid>

                <Grid item xs={12} lg={6} className="flex flex-col gap-2">
                  <label htmlFor="ais" className="text-lg font-semibold mt-4">
                    AIs
                  </label>
                  <Controller
                    name="ais"
                    control={control}
                    render={({ field }) => (
                      <Select
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
                      <Select
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
                      <Select
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
                Submit Tool
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

    if (!tool.toolAuthors.some((author) => author.authorId === userFromDB?.id)) {
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
