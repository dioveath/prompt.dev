import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { TextField, Typography } from "@mui/material";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Tool } from "@prisma/client";

const createToolClaimRequestMutation = gql`
  mutation createToolClaimRequest($toolId: ID!, $message: String!) {
    createToolClaimRequest(toolId: $toolId, message: $message) {
      id
      message
    }
  }
`;

interface ClaimToolDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tool: Tool
}

interface CreateToolClaimRequestInput {
  message: string;
}

export default function ClaimToolDialog({ open, setOpen, tool }: ClaimToolDialogProps) {
  const { id, title } = tool;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [createToolClaimRequest, { data, loading, error }] = useMutation(createToolClaimRequestMutation);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateToolClaimRequestInput>();
  
  const onSubmit = async (data: CreateToolClaimRequestInput) => {
    toast.promise(createToolClaimRequest({ variables: { toolId: id, message: data.message } }), {
      loading: "Sending Claim Request",
      success: "Claim Request Sent",
      error: "You've already sent a claim request for this tool",
    });
    setOpen(false);
  };


  const handleClose = () => {
    setOpen(false);
  };


  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title">{"Request for Claim of your Tool"}</DialogTitle>
      <DialogContent>
        <DialogContentText> Please leave me references for your claims. So that I don&apos;t have scavange through the internet to find you. </DialogContentText>
        <Typography variant="h5"> Tool - {title} </Typography>
        <TextField {...register("message", { required: "Please enter message", minLength: { value: 12, message: "At least 12 chars "} })} autoFocus margin="dense" id="name" label="Message" type="text" fullWidth multiline rows={4} helperText={errors.message?.message} error={!!errors.message}/>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleSubmit(onSubmit)} variant="contained" className="">
          Send the Claim Request
        </Button>
        <Button onClick={handleClose} autoFocus color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
