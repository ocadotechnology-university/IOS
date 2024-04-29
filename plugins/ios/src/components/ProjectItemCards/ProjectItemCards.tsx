import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardActions, Button, Typography, CardMedia } from '@material-ui/core';
import { ItemCardGrid, ItemCardHeader } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { iosApiRef } from '../../api'; // Adjust this import as needed
import { makeStyles } from '@material-ui/core/styles';

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

  return (
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
            <Button variant="contained" color="primary">
              Action
            </Button>
          </CardActions>
        </Card>
      ))}
    </ItemCardGrid>
  );
};
