import React, {useState} from 'react';
import { Grid, TextField, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';


export const ProjectInfo = ({ project }) => {

  const [isEditable, setIsEditable] = useState(false); // State to track edit mode    
  const handleEditClick = () => {
    setIsEditable(true); // Set edit mode to true
  };

  return (
    
    <Grid container spacing={2}>
        <Grid container justifyContent='flex-end'>
            <Grid item xs={11}>
                <h1>Project info</h1>
            </Grid>
            
            <Grid item>
                <IconButton size='medium' onClick={handleEditClick}>
                <EditIcon/>
                </IconButton>
            </Grid>
            <Grid item >
                <IconButton size='medium'>
                <DeleteIcon/>
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
    </Grid>
  );
};
