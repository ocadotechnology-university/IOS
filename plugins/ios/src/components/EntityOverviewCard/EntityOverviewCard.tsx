import React, { useState, useEffect } from 'react';
import { Typography, Paper } from '@material-ui/core';
import { ProjectInfo } from '../ProjectInfo';
import { ProjectFiles } from '../ProjectFiles';
import { ProjectDeleteDialog } from '../ProjectDeleteDialog';
import { CommentSection } from '../CommentSection';
import { useEntity } from '@backstage/plugin-catalog-react';
import { iosApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { GithubRepoPreview } from '../GithubRepoPreview';

type Props = {
  project_id: string;
  flag?: boolean; // Optional flag prop
};

export const EntityOverviewCard = ({ project_id, flag }: Props) => {
  const iosApi = useApi(iosApiRef);
  const { entity } = useEntity();
  const [project, setProject] = useState<any>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchProjectData = async () => {
    try {
      const entityRef = stringifyEntityRef(entity);
      console.log("Entity Reference:", entityRef);

      if (!entityRef) return;

      const fetchedProject = await iosApi.getProjectByRef(entityRef);
      console.log("LOGLOGLOG: ", fetchedProject);

      if (fetchedProject && fetchedProject.length > 0) {
        setProject(fetchedProject[0]);
      } else {
        setProject(null);
        console.error('No project found');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [iosApi, entity]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirmed = async () => {
    setOpenDeleteDialog(false);
    try {
      await iosApi.deleteProject(project_id);
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      fetchProjectData();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {project && (
        <>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <ProjectInfo project={project} onDeleteClick={handleDeleteClick} fetchProjects={fetchProjectData} />
          </div>
          {!flag ? (
            // Render this part if flag is false or not provided
            <>
              <Paper style={{ flex: '1 1 100%', minWidth: '300px', padding: '16px' }}>
                <GithubRepoPreview repoUrl={project.project_repository_link} />
              </Paper>
              <Paper style={{ flex: '1 1 100%', minWidth: '300px', padding: '16px' }}>
                <CommentSection projectId={project.project_id} />
              </Paper>
            </>
          ) : (
            // Render this part if flag is true
            <></>
          )}
        </>
      )}
      {openDeleteDialog && (
        <ProjectDeleteDialog
          project_id={project.project_id}
          onClose={handleCloseDeleteDialog}
          onDeleteConfirmed={handleDeleteConfirmed}
        />
      )}
    </div>
  );
};
