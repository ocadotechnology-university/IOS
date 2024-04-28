import React, { useState, ChangeEvent } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useApi } from '@backstage/core-plugin-api';
import { iosApiRef } from '../../api';

const useStyles = makeStyles({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
});

type AddProjectDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    project_name: string,
    project_description: string,
    project_owner: string,
    project_contributors: string
  ) => void;
};

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

  const handleProjectNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  const handleProjectDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProjectDescription(event.target.value);
  };

  const handleProjectOwnerChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProjectOwner(event.target.value);
  };

  const handleProjectContributorsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProjectContributors(event.target.value);
  };

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

      // Reset the input fields and close the dialog
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
          onChange={handleProjectNameChange}
          margin="normal"
        />
        <TextField
          label="Project Description"
          value={project_description}
          onChange={handleProjectDescriptionChange}
          multiline
          rows={4}
          margin="normal"
        />
        <TextField
          label="Project Owner"
          value={project_owner}
          onChange={handleProjectOwnerChange}
          margin="normal"
        />
        <TextField
          label="Project Contributors"
          value={project_contributors}
          onChange={handleProjectContributorsChange}
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
