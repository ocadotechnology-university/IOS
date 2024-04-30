import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useApi } from '@backstage/core-plugin-api';
import { iosApiRef } from '../../api';

const useStyles = makeStyles({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
});

type Props = {
  open: boolean;
  handleCloseDialog: () => void;
};

export const AddProjectDialog = ({ open, handleCloseDialog }: Props) => {
  const classes = useStyles();

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectOwner, setProjectOwner] = useState('');
  const [projectContributors, setProjectContributors] = useState('');

  const iosApi = useApi(iosApiRef);


  const handleSubmit = async () => {
    try {
      await iosApi.insertProject(
        projectName,
        projectDescription,
        projectOwner,
        projectContributors
      );
      handleCloseDialog(); 
    } catch (error) {
      console.error('Error adding project:', error);
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
      <DialogTitle>Add Project</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          label="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="Project Description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          multiline
          rows={4}
          margin="normal"
        />
        <TextField
          label="Project Owner"
          value={projectOwner}
          onChange={(e) => setProjectOwner(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Project Contributors"
          value={projectContributors}
          onChange={(e) => setProjectContributors(e.target.value)}
          multiline
          rows={2}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
        <Button onClick={handleCloseDialog} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
