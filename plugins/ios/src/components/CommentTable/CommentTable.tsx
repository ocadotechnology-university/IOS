import React, { useEffect, useState } from 'react';
import { Table, TableColumn } from '@backstage/core-components';
import { Button } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { iosApiRef } from '../../api';

export const ProjectComponent = () => {
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

    fetchProjects(); // Initial fetch to populate table
  }, [iosApi]);

  const handleDeleteProject = async (
    project_name: string,
    project_description: string,
    project_owner: string,
    project_contributors: string
  ) => {
    try {
      await iosApi.deleteProject(
        project_name,
        project_description,
        project_owner,
        project_contributors
      );

      const updatedProjects = projects.filter(
        p =>
          p.project_name !== project_name ||
          p.project_description !== project_description ||
          p.project_owner !== project_owner ||
          p.project_contributors !== project_contributors
      );
      setProjects(updatedProjects); // Update state after deletion
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const columns: TableColumn[] = [
    { title: 'Project Name', field: 'project_name' },
    { title: 'Project Description', field: 'project_description' },
    { title: 'Project Owner', field: 'project_owner' },
    { title: 'Project Contributors', field: 'project_contributors' },
    {
      title: 'Actions',
      field: 'actions',
      render: rowData => (
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            handleDeleteProject(
              rowData.project_name,
              rowData.project_description,
              rowData.project_owner,
              rowData.project_contributors
            )
          }
        >
          Delete
        </Button>
      ),
    },
  ];

  const data = projects.map(project => ({
    project_name: project.project_name,
    project_description: project.project_description,
    project_owner: project.project_owner,
    project_contributors: project.project_contributors,
    actions: '', // Actions is now set by the render method in TableColumn
  }));

  return <Table title="Projects" columns={columns} data={data} />;
};
