import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  CardActions,
} from '@material-ui/core';
import { ItemCardGrid, ItemCardHeader } from '@backstage/core-components';
import { useApi, alertApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { iosApiRef } from '../../api';
import { makeStyles } from '@material-ui/core/styles';
import { UpdateProjectDialog } from '../UpdateProjectDialog';
import { ProjectOverview } from '../ProjectOverview';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  card: {
    maxWidth: '800px',
    minWidth: '300px',
    minHeight: '200px',
    maxHeight: '500px',
    cursor: 'pointer', 
  },
  description: {
    wordWrap: 'break-word', 
  },
  noRecords: {
    textAlign: 'center',
    padding: '20px',
  },
});

export const Projects = () => {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);
  const iosApi = useApi(iosApiRef);
  const alertApi = useApi(alertApiRef);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [openProjectOverview, setOpenProjectOverview] = useState(false);

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
  }, []);

  useEffect(() => {
    if (!openProjectOverview) {
      fetchProjects();
    }
  }, [openProjectOverview]);

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setSelectedProjectId(project.project_id);
    setOpenProjectOverview(true);

  };

  return (
    <>
      {projects.length > 0 ? (
        <ItemCardGrid className={classes.grid}>
          {projects.map((project) => (
            <div
              key={project.project_title}
              className={classes.card}
              onClick={() => handleViewProject(project)}
            >
              <Card>
                <CardMedia>
                  <ItemCardHeader
                    title={project.project_title}
                    subtitle={project.project_manager_username}
                  />
                </CardMedia>
                <CardContent>
                  <Typography variant="body2" className={classes.description}>
                    {project.project_description}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="body2">
                    {project.project_team_owner_name}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </ItemCardGrid>
      ) : (
        <div className={classes.noRecords}>
          <Typography variant="body2">No records to display</Typography>
        </div>
      )}

      <ProjectOverview
        open={openProjectOverview}
        handleCloseDialog={() => setOpenProjectOverview(false)}
        project={selectedProject}
        project_id={selectedProjectId}
      />
    </>
  );
};
