import React, { useState } from 'react';
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

// Define your styles
const useStyles = makeStyles({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export const AddProjectDialog = ({ onSubmit }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false); // Dialog open state
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectOwner, setProjectOwner] = useState('');
  const [projectContributors, setProjectContributors] = useState('');

  const iosApi = useApi(iosApiRef);

  // Toggle dialog open/close
  const toggleDialog = () => {
    setOpen(!open); // Toggle the state
  };

  const handleClose = () => {
    setOpen(false); // Set open to false to close the dialog
  };

  const handleSubmit = async () => {
    try {
      await iosApi.insertProject(
        projectName,
        projectDescription,
        projectOwner,
        projectContributors
      );

      onSubmit(
        projectName,
        projectDescription,
        projectOwner,
        projectContributors
      );

      // Reset the form
      setProjectName('');
      setProjectDescription('');
      setProjectOwner('');
      setProjectContributors('');

      // Close the dialog after submission
      handleClose();
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
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
        <Button
          onClick={handleSubmit} 
          color="primary"
        >
          Submit
        </Button>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};


