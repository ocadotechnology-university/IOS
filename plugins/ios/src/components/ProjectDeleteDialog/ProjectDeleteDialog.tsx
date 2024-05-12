import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { iosApiRef } from '../../api';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';

export const ProjectDeleteDialog = ({ project_id, onClose, onDeleteConfirmed }) => {
    const iosApi = useApi(iosApiRef);
    const alertApi = useApi(alertApiRef);
  
    const handleDeleteProject = async () => {
      try {
        await iosApi.deleteProject(project_id);
      } catch (error) {
        console.error('Error deleting project:', error);
      } finally{
        onDeleteConfirmed(); 
        alertApi.post({
          message: 'Project has been deleted.',
          severity: 'success',
          display: 'transient',
        });
      }
    };
  
    return (
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this project?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteProject} color="secondary">
            Yes
          </Button>
          <Button onClick={onClose} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
};
