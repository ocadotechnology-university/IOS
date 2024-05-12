import React, { useEffect, useState } from 'react';
import { Table, TableColumn } from '@backstage/core-components';
import { Button } from '@material-ui/core';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';
import { iosApiRef } from '../../api';
import { ProjectOverview } from '../ProjectOverview';
import { UpdateProjectDialog } from '../UpdateProjectDialog'; 
import { ProjectDeleteDialog } from '../ProjectDeleteDialog'; // Import the ProjectDeleteDialog component

export const ProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const iosApi = useApi(iosApiRef);
  const alertApi = useApi(alertApiRef);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openProjectOverview, setOpenProjectOverview] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false); 
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // Define showDeleteDialog state

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

  const handleDeleteProject = async (project_id) => {
    try {
      await iosApi.deleteProject(project_id);
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      alertApi.post({
        message: 'Project has been deleted. ',
        severity: 'success',
        display: 'transient'
      });
      fetchProjects();
    }
  };
  const handleProjectDeleted = () => {
    setOpenProjectOverview(false); // Close the ProjectOverview dialog
  };
  

  const handleUpdateProject = (project) => {
    setSelectedProject(project);
    setOpenUpdateDialog(true);
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setOpenProjectOverview(true);
    fetchProjects();
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
            onClick={() => handleViewProject(rowData)}
          >
            View Project
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdateProject(rowData)}
          >
            Update
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
              updatedData.project_team_owner_ref
            );
          } catch (error) {
            console.error('Error updating project:', error);
          } finally {
            alertApi.post({
              message: 'Project has been updated. ',
              severity: 'success',
              display: 'transient'
            });
            fetchProjects();
          }
        }}
      />
      {selectedProject && (
        <ProjectOverview
          open={openProjectOverview}
          handleCloseDialog={() => setOpenProjectOverview(false)}
          project={selectedProject}
          project_id={selectedProject.project_id }
        />
      )}
      {showDeleteDialog && (
        <ProjectDeleteDialog
          project_id={selectedProject.project_id}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}

    </>
  );
};
