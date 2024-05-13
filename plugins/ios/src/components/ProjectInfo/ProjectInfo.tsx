import React, { useState } from 'react';
import { Grid, TextField, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { ProjectDeleteDialog } from '../ProjectDeleteDialog';
import { UpdateProjectDialog } from '../UpdateProjectDialog'; 
import { useApi } from '@backstage/core-plugin-api';
import { iosApiRef } from '../../api'; 
import { alertApiRef } from '@backstage/core-plugin-api';
import { TimeSinceUpdate } from '../DateTime';
import { TimeToDate } from "../DateTime"
type Props = {
  project: any;
  onDeleteClick: () => void;
  fetchProjects: () => void; 
};

export const ProjectInfo = ({ project, onDeleteClick, fetchProjects }: Props) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(project); 
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const iosApi = useApi(iosApiRef);
  const alertApi = useApi(alertApiRef);

  const handleEditClick = () => {
    setOpenUpdateDialog(true);


  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    onDeleteClick();
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid container justifyContent='flex-end'>
        <Grid item xs={11}>
          <h2>Project: {selectedProject.project_title}</h2>
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
      <Grid item xs={2} md={12}>
        <h4 style={{ color: 'rgba(209, 205, 205, 1)' }}>{selectedProject.project_description}</h4>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Last Updated"
          value={TimeSinceUpdate({ updateDate: selectedProject.project_update_date })}
          margin="normal"
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Project Initialization Date:"
          value={TimeToDate({startDate :selectedProject.project_start_date})}
          margin="normal"
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Project Description"
          value={selectedProject.project_description}
          margin="normal"
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Project Life Cycle Status"
          value={selectedProject.project_life_cycle_status}
          margin="normal"
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Project Manager"
          value={selectedProject.project_manager_username}
          margin="normal"
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Project Manager Reference"
          value={selectedProject.project_manager_ref}
          margin="normal"
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Project Team Owner"
          value={selectedProject.project_team_owner_name}
          margin="normal"
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Team Owner Reference"
          value={selectedProject.project_team_owner_ref}
          margin="normal"
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Project Docs Reference"
          value={selectedProject.project_docs_ref}
          margin="normal"
          fullWidth
          disabled
        />
      </Grid>
      
      {/* Conditionally render the delete dialog */}
      {openDeleteDialog && (
        <ProjectDeleteDialog
          project_id={project.project_id}
          onClose={handleCloseDeleteDialog}
        />
      )}

      {/* Conditionally render the update dialog */}
      <UpdateProjectDialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        project={selectedProject}
        onSubmit={async (updatedData) => {
          setOpenUpdateDialog(false);
          try {
          
            setSelectedProject({
              ...selectedProject,
              ...updatedData,
            });

           
            await iosApi.updateProject(
              selectedProject.project_id,
              updatedData.project_title,
              updatedData.project_description,
              updatedData.project_manager_username,
              updatedData.project_manager_ref,
              updatedData.project_docs_ref,
              updatedData.project_life_cycle_status,
              updatedData.project_team_owner_name,
              updatedData.project_team_owner_ref
            );
            fetchProjects();
          } catch (error) {
            console.error('Error updating project:', error);
          } finally{
                      
            alertApi.post({
              message: 'Project has been updated.',
              severity: 'info',
              display: 'transient'
            });
          }
        }}
      />
    </Grid>
  );
};
