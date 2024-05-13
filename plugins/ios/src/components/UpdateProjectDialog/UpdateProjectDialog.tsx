import React, { useState, useEffect } from 'react';
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

export const UpdateProjectDialog = ({ open, onClose, project, onSubmit }) => {
  const classes = useStyles();
  const [project_title, setProjectTitle] = useState('');
  const [project_description, setProjectDescription] = useState('');
  const [project_manager_username, setProjectManagerUsername] = useState('');
  const [project_manager_ref, setProjectManagerRef] = useState('');
  const [project_docs_ref, setProjectDocsRef] = useState('');
  const [project_life_cycle_status, setProjectLifeCycleStatus] = useState('');
  const [project_team_owner_name, setProjectTeamOwnerName] = useState('');
  const [project_team_owner_ref, setProjectTeamOwnerRef] = useState('');
  const [project_version, setProjectVersion] = useState('');

  const [isValidForm, setIsValidForm] = useState(false);

  const iosApi = useApi(iosApiRef);

  useEffect(() => {
    if (project) {
      setProjectTitle(project.project_title);
      setProjectDescription(project.project_description);
      setProjectManagerUsername(project.project_manager_username);
      setProjectManagerRef(project.project_manager_ref);
      setProjectDocsRef(project.project_docs_ref);
      setProjectLifeCycleStatus(project.project_life_cycle_status);
      setProjectTeamOwnerName(project.project_team_owner_name);
      setProjectTeamOwnerRef(project.project_team_owner_ref);
      setProjectVersion(project.project_version || ''); // Handle null or undefined
    }
  }, [project]); 

  useEffect(() => {
    setIsValidForm(
      project_title.trim() !== '' &&
      project_description.trim() !== '' &&
      project_manager_username.trim() !== '' &&
      project_life_cycle_status.trim() !== '' &&
      project_team_owner_name.trim() !== '' &&
      project_manager_ref.trim() !== '' &&
      project_docs_ref.trim() !== '' &&
      project_version.trim() !== '' && // Add validation for project_version
      (!project_manager_ref || isValidUrl(project_manager_ref)) &&
      (!project_docs_ref || isValidUrl(project_docs_ref)) &&
      isValidUrl(project_team_owner_ref)
    );
  }, [project_title, project_description, project_manager_username, project_life_cycle_status, project_team_owner_name, project_manager_ref, project_docs_ref, project_team_owner_ref, project_version]);

  const isValidUrl = (url) => {
    const urlPattern = /^https?:\/\/.*$/;
    return urlPattern.test(url);
  };

  const handleSubmit = () => {
    if (!isValidForm) {
      console.error('Invalid form data');
      return;
    }

    const updatedData = {
      project_title, 
      project_description, 
      project_manager_username,
      project_manager_ref,
      project_docs_ref,
      project_life_cycle_status,
      project_team_owner_name,
      project_team_owner_ref,
      project_version, // Include project_version in updatedData
    };
  
    onSubmit(updatedData); 
    onClose(); 
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Project</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          label="Project Title"
          value={project_title}
          onChange={(e) => setProjectTitle(e.target.value)}          
          margin="normal"
          required
        />
        <TextField
          label="Project Description"
          value={project_description}
          onChange={(e) => setProjectDescription(e.target.value)}
          multiline
          rows={4}
          margin="normal"
          required
        />
        <TextField
          label="Project Manager"
          value={project_manager_username}
          onChange={(e) => setProjectManagerUsername(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="Manager Link"
          value={project_manager_ref}
          onChange={(e) => setProjectManagerRef(e.target.value)}
          multiline
          rows={2}
          margin="normal"
          error={project_manager_ref && !isValidUrl(project_manager_ref)}
          helperText={
            project_manager_ref && !isValidUrl(project_manager_ref)
              ? 'Not a valid URL'
              : ''
          }
        />
        <TextField
          label="Docs Link"
          value={project_docs_ref}
          onChange={(e) => setProjectDocsRef(e.target.value)}
          multiline
          rows={2}
          margin="normal"
          error={project_docs_ref && !isValidUrl(project_docs_ref)}
          helperText={
            project_docs_ref && !isValidUrl(project_docs_ref)
              ? 'Not a valid URL'
              : ''
          }
        />
        <TextField
          label="Life Cycle"
          value={project_life_cycle_status}
          onChange={(e) => setProjectLifeCycleStatus(e.target.value)}
          multiline
          rows={2}
          margin="normal"
          required
        />
        <TextField
          label="Team Owner"
          value={project_team_owner_name}
          onChange={(e) => setProjectTeamOwnerName(e.target.value)}
          multiline
          rows={2}
          margin="normal"
          required
        />
        <TextField
          label="Team Link"
          value={project_team_owner_ref}
          onChange={(e) => setProjectTeamOwnerRef(e.target.value)}
          multiline
          rows={2}
          margin="normal"
          required
          error={!isValidUrl(project_team_owner_ref)}
          helperText={
            !isValidUrl(project_team_owner_ref)
              ? 'Not a valid URL'
              : ''
          }
        />
        <TextField
          label="Project Version"
          value={project_version}
          onChange={(e) => setProjectVersion(e.target.value)}
          multiline
          rows={2}
          margin="normal"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" disabled={!isValidForm}>
          Submit
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};