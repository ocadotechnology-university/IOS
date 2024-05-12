import React, { useState } from 'react';
import { Grid, TextField, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { ProjectDeleteDialog } from '../ProjectDeleteDialog'; 

type Props = {
  project: any;
  onDeleteClick: () => void; 
};

export const ProjectInfo = ({ project, onDeleteClick }: Props) => {
  const [isEditable, setIsEditable] = useState(false); 
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    onDeleteClick(); 
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false); 
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  return (
    <Grid container spacing={2}>
      <Grid container justifyContent='flex-end'>
        <Grid item xs={11}>
          <h1>Project info</h1>
        </Grid>

        <Grid item>
          <IconButton size='medium' onClick={handleEditClick}>
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid item >
          <IconButton size='medium' onClick={handleDeleteClick}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Project Title"
          value={project.project_title}
          margin="normal"
          fullWidth
          disabled={!isEditable}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Project Description"
          value={project.project_description}
          margin="normal"
          fullWidth
          disabled={!isEditable}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Project Life Cycle Status"
          value={project.project_life_cycle_status}
          margin="normal"
          fullWidth
          disabled={!isEditable}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Project Manager"
          value={project.project_manager_username}
          margin="normal"
          fullWidth
          disabled={!isEditable}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Project Manager reference"
          value={project.project_manager_ref}
          margin="normal"
          fullWidth
          disabled={!isEditable}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Project Team Owner"
          value={project.project_team_owner_name}
          margin="normal"
          fullWidth
          disabled={!isEditable}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Team Owner reference"
          value={project.project_team_owner_ref}
          margin="normal"
          fullWidth
          disabled={!isEditable}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Project Docs reference"
          value={project.project_docs_ref}
          margin="normal"
          fullWidth
          disabled={!isEditable}
        />
      </Grid>
      {/* Conditionally render the delete dialog */}
      {openDeleteDialog && (
        <ProjectDeleteDialog
          project_id={project.project_id}
          onClose={handleCloseDeleteDialog}
        />
      )}
    </Grid>
  );
};
