import React, { useEffect, useState } from 'react';
import { Table, TableColumn } from '@backstage/core-components';
import { Button } from '@material-ui/core';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';
import { iosApiRef } from '../../api';
import { ProjectOverview } from '../ProjectOverview';


export const ProjectTable = () => {
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

  const handleViewProject = (project, project_id) => {
    setSelectedProject(project);
    setSelectedProjectId(project_id); 
    setOpenProjectOverview(true);
  };

  const columns: TableColumn[] = [
    { title: 'Project Title', field: 'project_title' },
    { title: 'Project Description', field: 'project_description' },
    { title: 'Project Manager', field: 'project_manager_username' },
    { title: 'Project Team Owner', field: 'project_team_owner_name' },
    {
      title: 'Actions',
      field: 'actions',
      render: (rowData) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleViewProject(rowData, rowData.project_id)}
          >
            View Project
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        title="Projects"
        columns={columns}
        data={projects}
      />
      <ProjectOverview
        open={openProjectOverview}
        handleCloseDialog={() => setOpenProjectOverview(false)}
        project={selectedProject}
        project_id={selectedProjectId} 
      />
    </>
  );
};
