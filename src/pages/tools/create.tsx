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
        error: "Error creating AI Tool 😢😢😢" + error,
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
            <h1 className="font-bold text-2xl my-4">Submit you cool AI Tool with us </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2  ">
              <label htmlFor="title">Title</label>
              <TextField type="text" {...register("title", { required: true })} variant="filled" multiline maxRows={1} />
              {errors.title && <span className="text-red-500 text-xs"> {errors.title.message} </span>}

              <label htmlFor="shortDescription">Short Description</label>
              <TextField type="text" {...register("shortDescription")} variant="filled" multiline rows={2} maxRows={2} />
              {errors.shortDescription && <span className="text-red-500 text-xs"> {errors.shortDescription.message}</span>}

              <label htmlFor="description">Description</label>
              <TextField type="text" {...register("description")} variant="filled" multiline rows={4} maxRows={4} />
              {errors.description && <span className="text-red-500 text-xs"> {errors.description.message}</span>}

              <Grid container spacing={4}>
                <Grid item xs={12} lg={6} className="flex flex-col gap-2">
                  <label htmlFor="website">Website</label>
                  <TextField type="text" {...register("website", { required: true })} variant="filled" multiline maxRows={1} />
                  {errors.website && <span className="text-red-500 text-xs"> {errors.website.message}</span>}

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
