import React, { useState, useEffect } from 'react';
import { Grid, TextField, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import LinkIcon from '@material-ui/icons/Link';
import DeleteIcon from '@material-ui/icons/Delete';
import { ProjectDeleteDialog } from '../ProjectDeleteDialog';
import { UpdateProjectDialog } from '../UpdateProjectDialog';
import { useApi } from '@backstage/core-plugin-api';
import { iosApiRef } from '../../api';
import { alertApiRef } from '@backstage/core-plugin-api';
import { TimeSinceUpdate } from '../DateTime';
import { TimeToDate } from "../DateTime"
import { parseEntityRef } from '@backstage/catalog-model';

type ProjectInfoProps = {
  project?: any;
  entity_ref?: string;
  onDeleteClick: () => void;
  fetchProjects: () => void;
};

export const ProjectInfo = ({ project, entity_ref, onDeleteClick, fetchProjects }: ProjectInfoProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(project);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [linkedEntity, setLinkedEntity] = useState(null);
  const iosApi = useApi(iosApiRef);
  const alertApi = useApi(alertApiRef);

  useEffect(() => {
    // If project is provided, set selectedProject directly
    if (project) {
      setSelectedProject(project);
    } else if (entity_ref) {
      // Fetch project using entity_ref
      iosApi.getProjectByRef(entity_ref)
        .then(project => setSelectedProject(project))
        .catch(error => console.error('Error fetching project:', error));
      console.log("!!!!!!!!!!!!!!!!!!", selectedProject.project_id);
    }
  }, [project, entity_ref]);

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

  useEffect(() => {
    if (selectedProject && selectedProject.project_entity_ref) {
      const parsedEntity = parseEntityRef(selectedProject.project_entity_ref);
      console.log("!!!!!!!!!!!!!!!!!!", selectedProject.project_id);
      setLinkedEntity(parsedEntity);
    }
  }, [selectedProject]);
  return (
    <Grid container spacing={2}>
      <Grid container justifyContent='space-between' alignItems='center'>
        <Grid item xs={6}>
          <h1 style={{ fontSize: "30px", margin: "0" }}>Project: {selectedProject.project_title}</h1>
        </Grid>
        <Grid item xs={3} container justifyContent='flex-end'>
          <IconButton size='medium' onClick={handleEditClick} style={{ marginLeft: "8px" }}>
            <EditIcon />
          </IconButton>
          <IconButton size='medium' onClick={handleDeleteClick} style={{ marginLeft: "8px" }}>
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

      <Grid item xs={12} md={6}>
        <TextField
          label="Project Version"
          value={selectedProject.project_version}
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
              project.project_id,
              updatedData.project_title,
              updatedData.project_description,
              updatedData.project_manager_username,
              updatedData.project_manager_ref,
              updatedData.project_docs_ref,
              updatedData.project_life_cycle_status,
              updatedData.project_team_owner_name,
              updatedData.project_team_owner_ref,
              updatedData.project_version,
            );
            fetchProjects();
          } catch (error) {
            console.error('Error updating project:', error);
          } finally {
            alertApi.post({
              message: 'Project has been updated.',
              severity: 'info',
              display: 'transient'
            });
          }
        }}
      />

      {/* Render linked entity information */}
      {linkedEntity && (
        <Grid item xs={12}>
          <h3>Linked Entity Information</h3>
          <p>Name: {linkedEntity.name}</p>
          <p>Type: {linkedEntity.type}</p>
          {/* Add more fields as needed */}
        </Grid>
      )}
    </Grid>
  );
};
