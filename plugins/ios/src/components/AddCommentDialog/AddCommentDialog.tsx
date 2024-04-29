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

export const AddProjectDialog = ({
  open,
  onClose,
  onSubmit,
}: AddProjectDialogProps) => {
  const classes = useStyles();
  const [project_name, setProjectName] = useState('');
  const [project_description, setProjectDescription] = useState('');
  const [project_owner, setProjectOwner] = useState('');
  const [project_contributors, setProjectContributors] = useState('');

  const iosApi = useApi(iosApiRef);

  const handleSubmit = async () => {
    try {
      await iosApi.insertProject(
        project_name,
        project_description,
        project_owner,
        project_contributors
      );

      onSubmit(
        project_name,
        project_description,
        project_owner,
        project_contributors
      );

      setProjectName('');
      setProjectDescription('');
      setProjectOwner('');
      setProjectContributors('');
      onClose();
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Project</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          label="Project Name"
          value={project_name}
          onChange={(e) => setProjectName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Project Description"
          value={project_description}
          onChange={(e) => setProjectDescription(e.target.value)}
          multiline
          rows={4}
          margin="normal"
        />
        <TextField
          label="Project Owner"
          value={project_owner}
          onChange={(e) => setProjectOwner(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Project Contributors"
          value={project_contributors}
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
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
