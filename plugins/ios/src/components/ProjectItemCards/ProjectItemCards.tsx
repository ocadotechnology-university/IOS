import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CardMedia,
} from '@material-ui/core';
import { ItemCardGrid, ItemCardHeader } from '@backstage/core-components';
import { useApi, alertApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { iosApiRef } from '../../api';
import { makeStyles } from '@material-ui/core/styles';
import { UpdateProjectDialog } from '../UpdateProjectDialog';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  card: {
    maxWidth: '800px',
    minWidth: '300px',
    minHeight: '300px',
    maxHeight: '400px',
  },
  noRecords: {
    textAlign: 'center',
    padding: '20px',
  },
});

export const Projects = () => {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const iosApi = useApi(iosApiRef);
  const alertApi = useApi(alertApiRef);
  const identity = useApi(identityApiRef);
  const [userDisplayName, setUserDisplayName] = useState('');
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchUserDisplayName = async () => {
    try {
      const profile = await identity.getProfileInfo();
      setUserDisplayName(profile.displayName || 'Unknown User');
    } catch (error) {
      console.error('Error fetching user display name:', error);
      setUserDisplayName('Error Fetching User');
    }
  };

  const fetchUsers = async () => {
    try {
      const userData = await iosApi.getMembers();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const projectData = await iosApi.getProjects();
      setProjects(projectData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
    fetchUserDisplayName(); // Fetch the current user's display name
  }, []);

  const handleDeleteProject = async (project_id) => {
    try {
      await iosApi.deleteProject(project_id);
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      fetchProjects();
      alertApi.post({
        message: 'Project has been deleted.',
        severity: 'success',
        display: 'transient',
      });
    }
  };

  const handleUpdateProject = (project) => {
    setSelectedProject(project);
    setOpenUpdateDialog(true);
  };

  return (
    <>
      {projects.length > 0 ? (
        <ItemCardGrid className={classes.grid}>
          {projects.map((project) => (
            <Card key={project.project_title} className={classes.card}>
              <CardMedia>
                <ItemCardHeader title={project.project_title} subtitle={project.project_manager_username} />
              </CardMedia>
              <CardContent>
                <Typography variant="body2">{project.project_description}</Typography>
              </CardContent>
              <CardContent>
                <Typography variant="body2">{project.project_team_owner_name}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdateProject(project)}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteProject(project.project_id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </ItemCardGrid>
      ) : (
        <div className={classes.noRecords}>
          <Typography variant="body2">No records to display</Typography>
          <Typography variant="body2">
            Logged in as: {userDisplayName}
          </Typography>
        </div>
      )}

      <UpdateProjectDialog
        open={openUpdateDialog}
        project={selectedProject}
        onClose={() => setOpenUpdateDialog(false)}
        onSubmit={async (updatedData) => {
          setOpenUpdateDialog(false);
          try {
            await iosApi.updateProject(
              selectedProject.project_id,
              updatedData.project_title,
              updatedData.project_description,
              updatedData.project_manager_username,
              updatedData.project_manager_ref,
              updatedData.project_docs_ref,
              updatedData.project_life_cycle_status,
              updatedData.project_team_owner_name,
              updatedData.project_team_owner_ref,
            );
          } catch (error) {
            console.error('Error updating project:', error);
          } finally {
            alertApi.post({
              message: 'Project has been updated.',
              severity: 'success',
              display: 'transient',
            });
            fetchProjects();
          }
        }}
      />
    </>
  );
};
