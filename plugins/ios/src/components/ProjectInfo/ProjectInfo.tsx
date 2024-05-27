import React, { useState, useEffect } from 'react';
import { Grid, IconButton, Typography, Paper, Box, Link } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { ProjectDeleteDialog } from '../ProjectDeleteDialog';
import { UpdateProjectDialog } from '../UpdateProjectDialog';
import { useApi } from '@backstage/core-plugin-api';
import { iosApiRef } from '../../api';
import { alertApiRef } from '@backstage/core-plugin-api';
import { TimeSinceUpdate } from '../DateTime';
import { TimeToDate } from "../DateTime";
import EmailIcon from '@material-ui/icons/Email';
import GitHubIcon from '@material-ui/icons/GitHub';
import DescriptionIcon from '@material-ui/icons/Description';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { StatusIndicator } from '../StatusIndicator';
import { makeStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import MemoryIcon from '@material-ui/icons/Memory';

const useStyles = makeStyles((theme) => ({
  iconLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '4px',
    padding: '4px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  icon: {
    fontSize: '25px',
    color: theme.palette.primary.main,
  },
  iconText: {
    textDecoration: 'none',
    marginTop: '4px',
    color: theme.palette.primary.main,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  gridContainer: {
    flexWrap: 'wrap',
    gap: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  section: {
    marginBottom: theme.spacing(2),
    fontSize: '16px',
  },
  info: {
    marginBottom: theme.spacing(1),
  },
  label: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  },
  value: {
    fontWeight: 'normal',
  },
  iconButtons: {
    display: 'flex',
    alignItems: 'center',
  },
  iconButtonSpacing: {
    marginRight: theme.spacing(1),
  },
  entityLink: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

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
  const classes = useStyles();

  useEffect(() => {
    if (project) {
      setSelectedProject(project);
    } else if (entity_ref) {
      iosApi.getProjectByRef(entity_ref)
        .then(project => setSelectedProject(project))
        .catch(error => console.error('Error fetching project:', error));
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
      setLinkedEntity(parsedEntity);
    }
  }, [selectedProject]);

  return (
    <Paper className={classes.paper}>
      <Box className={classes.header}>
        <Typography variant="h3">{selectedProject.project_title}</Typography>
        <Box className={classes.iconButtons}>
          <IconButton size="small" onClick={handleEditClick} className={classes.iconButtonSpacing}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" onClick={handleDeleteClick}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <StatusIndicator project={project} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body1" className={classes.section}>
            {selectedProject.project_description}
          </Typography>
        </Grid>
        <Grid item xs={12} md={2}>
          <Box className={classes.info}>
            <Typography className={classes.label} display="inline">Last Updated:</Typography>
            <Typography className={classes.value} display="inline">{TimeSinceUpdate({ updateDate: selectedProject.project_update_date })}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box className={classes.info}>
            <Typography className={classes.label} display="inline">Project Initialization Date:</Typography>
            <Typography className={classes.value} display="inline">{TimeToDate({ startDate: selectedProject.project_start_date })}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box className={classes.info} display="flex" alignItems="center">
            <Typography className={classes.label} display="inline">Project Manager Username:</Typography>
            <PersonIcon fontSize="small" style={{ marginRight: 4 }} />
            <Link
              href={`/catalog/default/user/${selectedProject.project_manager_username}`}
              target="_blank"
              rel="noopener"
              className={classes.value}
              display="inline"
            >
              {selectedProject.project_manager_username}
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <a
            href={selectedProject.project_manager_ref}
            className={classes.iconLink}
          >
            <EmailIcon className={classes.icon} />
            <Typography variant="body1" className={classes.iconText}>
              Project Manager
            </Typography>
          </a>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box className={classes.info} display="flex" alignItems="center">
            <Typography className={classes.label} display="inline">Team Owner Name:</Typography>
            <PeopleIcon fontSize="small" style={{ marginRight: 4 }} />
            <Link
              href={`/catalog/default/group/${selectedProject.project_team_owner_name}`}
              target="_blank"
              rel="noopener"
              className={classes.value}
              display="inline"
            >
              {selectedProject.project_team_owner_name}
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <a
            href={selectedProject.project_team_owner_ref}
            className={classes.iconLink}
          >
            <EmailIcon className={classes.icon} />
            <Typography variant="body1" className={classes.iconText}>
              Team Owner
            </Typography>
          </a>
        </Grid>
        <Grid item xs={12} md={6}>
          <a
            href={selectedProject.project_docs_ref}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.iconLink}
          >
            <DescriptionIcon className={classes.icon} />
            <Typography variant="body1" className={classes.iconText}>
              Project Docs
            </Typography>
          </a>
        </Grid>
        <Grid item xs={12} md={6}>
          <a
            href={selectedProject.project_repository_link}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.iconLink}
          >
            <GitHubIcon className={classes.icon} />
            <Typography variant="body1" className={classes.iconText}>
              GitHub repository
            </Typography>
          </a>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box className={classes.info}>
            <Typography className={classes.label} display="inline">Project Version:</Typography>
            <Typography className={classes.value} display="inline">{selectedProject.project_version}</Typography>
          </Box>
        </Grid>

        {linkedEntity && (
          <Grid item xs={12} md={6}>
            <Box className={classes.info} display="flex" alignItems="center">
              <MemoryIcon fontSize="small" style={{ marginRight: 4 }} />
              <Link
                href={`/catalog/default/component/${stringifyEntityRef(linkedEntity)}`}
                className={classes.value}
                display="inline"
              >
                Entity Page
              </Link>
            </Box>
          </Grid>
        )}
      </Grid>

      {openDeleteDialog && (
        <ProjectDeleteDialog
          project_id={project.project_id}
          onClose={handleCloseDeleteDialog}
        />
      )}

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
    </Paper>
  );
};
