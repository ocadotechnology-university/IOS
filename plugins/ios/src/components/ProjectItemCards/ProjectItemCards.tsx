import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardActions, Button, Typography, CardMedia } from '@material-ui/core';
import { ItemCardGrid, ItemCardHeader } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
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
});

export const Projects = () => {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);
  const iosApi = useApi(iosApiRef);

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await iosApi.getProjects();
        setProjects(projectData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [iosApi]);

  const handleDeleteProject = async (
    project_name,
    project_description,
    project_owner,
    project_contributors
  ) => {
    try {
      await iosApi.deleteProject(
        project_name,
        project_description,
        project_owner,
        project_contributors
      );

      const updatedProjects = projects.filter(
        (p) =>
          p.project_name !== project_name ||
          p.project_description !== project_description ||
          p.project_owner !== project_owner ||
          p.project_contributors !== project_contributors
      );
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleUpdateProject = (project) => {
    setSelectedProject(project); 
    setOpenUpdateDialog(true);   
  };

  return (
    <>
      <ItemCardGrid className={classes.grid}>
        {projects.map((project) => (
          <Card key={project.project_name} className={classes.card}>
            <CardMedia>
              <ItemCardHeader title={project.project_name} subtitle={project.project_owner} />
            </CardMedia>
            <CardContent>
              <Typography variant="body2">{project.project_description}</Typography>
            </CardContent>
            <CardContent>
              <Typography variant="body2">{project.project_contributors}</Typography>
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
                onClick={() => handleDeleteProject(
                  project.project_name,
                  project.project_description,
                  project.project_owner,
                  project.project_contributors
                )}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </ItemCardGrid>

      <UpdateProjectDialog
        open={openUpdateDialog}
        project={selectedProject}
        onClose={() => setOpenUpdateDialog(false)} 
        onSubmit={() => {
          setOpenUpdateDialog(false); 
          const fetchProjects = async () => {
            try {
              const projectData = await iosApi.getProjects();
              setProjects(projectData);
            } catch (error) {
              console.error('Error fetching projects:', error);
            }
          };
          fetchProjects();
        }}
      />
    </>
  );
};
