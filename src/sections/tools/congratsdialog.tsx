import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import React from 'react'

interface CongratsDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title?: string;
}

export default function CongratsDialog({ open, setOpen }: CongratsDialogProps) {

  return (
    <Dialog fullScreen={false} open={open} aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title">Congratulations</DialogTitle>
      <DialogContent>
        <DialogContentText> Thank you for submitting your great tool. We&apos;ll pass by and check it for publishing. </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus variant='contained' href='/tools'> Explore tools </Button>
      </DialogActions>
    </Dialog>
  );
}
