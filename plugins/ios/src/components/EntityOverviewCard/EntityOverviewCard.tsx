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

type Props = {
  project_id: string;
};

export const EntityOverviewCard = ({ project_id }: Props) => {
  const iosApi = useApi(iosApiRef);
  const { entity } = useEntity();
  const [project, setProject] = useState<any>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const entityRef = stringifyEntityRef(entity);
        console.log("Entity Reference:", entityRef);
        if (!entityRef) return;
        
        const fetchedProject = await iosApi.getProjectByRef(entityRef);
        console.log("LOGLOGLOG: ", fetchedProject);

        if (fetchedProject && fetchedProject.length > 0) {
          setProject(fetchedProject[0]);
        } else {
          console.error('No project found');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchData();
  }, [iosApi, entity]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirmed = () => {
    handleCloseDeleteDialog();
    // Additional logic if needed after deletion confirmation
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {project && (
        <>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Paper style={{ flex: '1 1 45%', minWidth: '300px', padding: '16px' }}>
              <Typography variant="h6">Project Info</Typography>
              <ProjectInfo project={project} onDeleteClick={handleDeleteClick} />
            </Paper>
            <Paper style={{ flex: '1 1 45%', minWidth: '300px', padding: '16px' }}>
              <Typography variant="h6">Project Files</Typography>
              <ProjectFiles />
            </Paper>
          </div>
          <Paper style={{ flex: '1 1 100%', minWidth: '300px', padding: '16px' }}>
            <Typography variant="h6">Comments</Typography>
            <CommentSection projectId={project.project_id} />
          </Paper>
        </>
      )}
      {openDeleteDialog && (
        <ProjectDeleteDialog
          project_id={project_id}
          onClose={handleCloseDeleteDialog}
          onDeleteConfirmed={handleDeleteConfirmed}
        />
      )}
    </div>
  );
};


