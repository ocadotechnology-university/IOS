import React, { useState, ChangeEvent } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { iosApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { IosApi } from '../../api'; 

const useStyles = makeStyles({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
});

type AddCommentDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void; 
};

export const AddCommentDialog = ({ open, onClose, onSubmit }: AddCommentDialogProps) => {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const iosApi = useApi(iosApiRef) as IosApi; 
  
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      await iosApi.insertComment(title, description);
      onSubmit(title, description);
      setTitle('');
      setDescription('');
      onClose(); // Close doesn't work
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Comment</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          label="Username"
          value={title}
          onChange={handleTitleChange}
          margin="normal"
        />
        <TextField
          label="Comment"
          value={description}
          onChange={handleDescriptionChange}
          margin="normal"
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
