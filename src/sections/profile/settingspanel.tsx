import TabPanel from "@/components/globals/tabpanel";
import { gql, useMutation } from "@apollo/client";
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  Container,
  Grid,
  Link,
  TextField,
} from "@mui/material";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import apolloClient from "../../../lib/apollo";

interface SettingsPanelProps {
  userData: any;
  index: number;
  value: number;
}

const updateUserMutation = gql`
  mutation updateMe($name: String, $username: String, $jobTitle: String, $avatar: String) {
    updateMe(name: $name, username: $username, jobTitle: $jobTitle, avatar: $avatar) {
      id
      name
      username
      jobTitle
      avatar
    }
  }
`;

type UpdateUserInputProps = {
  name?: string;
  username?: string;
  jobTitle?: string;
  avatar?: string;
};

export default function SettingsPanel({ userData, index, value }: SettingsPanelProps) {
  const [updateUser, { loading, error }] = useMutation(updateUserMutation);
  const { control, register, handleSubmit, formState: { errors } } = useForm<UpdateUserInputProps>();

  const onSubmit: SubmitHandler<UpdateUserInputProps> = async (data) => {  
    try {
      await toast.promise(updateUser({ variables: data }), {
        loading: "Updating your profile... 🔃🔃",
        success: "Profile updated successfully! 🎉🎉",
        error: "Failed to update your profile. ‼️‼️❗",
      });
      apolloClient.refetchQueries({ include: "active" });
    } catch(e) {
      console.log("Error: " + e);
    }
    
  };

  return (
    <TabPanel index={index} value={value}>
      <Grid container className="py-4" spacing={4}>
        <Grid item container xs={12} md={8}>
          <Container>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <TextField {...register("name", { required: true, maxLength: 32 }) } label="Name" variant="filled" defaultValue={userData.name} multiline maxRows={1} 
              error={!!errors.name} helperText={errors.name?.message}/>
              <TextField {...register("username", { maxLength: 32 })} label="Username" variant="filled" defaultValue={userData.username} multiline maxRows={1}
                          error={!!errors.username} helperText={errors.username?.message} />
              <TextField {...register("jobTitle", { maxLength: 48 })} label="Headline" variant="filled" defaultValue={userData.jobTitle} multiline maxRows={1}
                          error={!!errors.jobTitle} helperText={errors.jobTitle?.message}/>
              <TextField {...register("avatar", { maxLength: 256 })} label="Avatar URL" variant="filled" defaultValue={userData.avatar} multiline maxRows={1}
                          error={!!errors.avatar} helperText={errors.avatar?.message}/>
              <TextField label="Email" variant="filled" defaultValue={userData.email} disabled multiline maxRows={1}/>
              <Button type="submit" variant="contained" className="shadow-none"> Update Your Profile </Button>
            </form>
          </Container>
        </Grid>
        <Grid item xs={12} md={4}>
        </Grid>
      </Grid>
    </TabPanel>
  );
}