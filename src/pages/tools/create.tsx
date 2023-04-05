import React from "react";
import dynamic from "next/dynamic";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { gql, useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import Navbar from "@/components/globals/navbar";
import { Container, Button, TextField, Grid } from "@mui/material";
const Select = dynamic(import("react-select"), { ssr: false });
import Footer from "@/sections/footer";

const createAICategoryQuery = gql`
  mutation CreateTool($title: String!, $description: String, $shortDescription: String, $avatar: String, $website: String!, $categoryId: ID, $ais: [ID!], $skills: [ID!]) {
    createTool(title: $title, description: $description, shortDescription: $shortDescription, avatar: $avatar, website: $website, categoryId: $categoryId, ais: $ais, skills: $skills) {
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

type CreateToolProps = {
  title: string;
  shortDescription?: string;
  description?: string;
  avatar?: string;
  categoryId?: string;
  website: string;
  ais?: string[];
  skills?: string[];
};

export default function CreateAIPage() {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateToolProps>();
  const [createAI, { data, loading, error }] = useMutation(createAICategoryQuery);
  const { data: aisData, loading: aisLoading, error: aisError } = useQuery(aisQuery);
  const { data: skillsData, loading: skillsLoading, error: skillsError } = useQuery(skillsQuery);
  const { data: toolCategoryData, loading: toolCategoryLoading, error: toolCategoryError } = useQuery(toolCategoryQuery);

  const onSubmit: SubmitHandler<CreateToolProps> = (data) => {
    const { title, shortDescription, description, avatar, website, categoryId, ais, skills } = data;

    let aiIds: any = ais?.map((ai: any) => ai.id);
    let skillIds: any = skills?.map((skill: any) => skill.id);

    try {
      toast.promise(createAI({ variables: { title, shortDescription, description, avatar, website, categoryId, ais: aiIds, skills: skillIds } }), {
        loading: "Creating AI Tool 🔃🔃🔃",
        success: "AI Tool created successfully! 🎉🎉🎉",
        error: "Error creating AI Tool 😢😢😢, Please try again later",
      });
      console.log(data);
    } catch (error) {
      toast.error("Error creating AI Tool😢😢😢");
    }
  };

  return (
    <>
      <Navbar path="/tools/create" />
      <Container>
        <Grid container className="my-4">
          <Grid item xs={12} justifyContent={"center"}>
            <h1 className="font-bold text-2xl my-4">Submit you cool <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> AI Tool </span> with us </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2  ">
<label htmlFor="title">Title</label>
              <TextField type="text" {...register("title", { required: "Title is required" })} variant="filled" multiline rows={1} helperText={errors.title?.message} error={!!errors.title}/>

              <label htmlFor="shortDescription">Short Description</label>
              <TextField type="text" {...register("shortDescription", { required: "Short Description is required", maxLength: { value: 64, message: "Can't be more than 64 chars"} })} variant="filled" multiline rows={2}  helperText={errors.shortDescription?.message} error={!!errors.shortDescription} />

              <label htmlFor="description">Description</label>
              <TextField type="text" {...register("description", { required: "Description is required", maxLength: { value: 2048, message: "Can't be more than 2048 chars" } })} variant="filled" multiline rows={4} helperText={errors.description?.message} error={!!errors.description}/>

              <Grid container spacing={4}>
                <Grid item xs={12} lg={6} className="flex flex-col gap-2">
                  <label htmlFor="website">Website</label>
                  <TextField type="text" {...register("website", { required: "Website is required" })} variant="filled" multiline maxRows={1} helperText={errors.website?.message} error={!!errors.website}/>

                  <label htmlFor="avatar">Avatar</label>
                  <TextField type="text" {...register("avatar")} variant="filled" multiline maxRows={1} />
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
                      />
                    )}
                  />

                  <label htmlFor="toolCategories" className="text-lg font-semibold mt-4">
                    Tool Categories
                  </label>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={toolCategoryData?.toolCategories}
                        isMulti={false}
                        getOptionLabel={(option: any) => option.title}
                        getOptionValue={(option: any) => option.id}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Button type="submit" variant="contained">
                {" "}
                Submit Tool{" "}
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
