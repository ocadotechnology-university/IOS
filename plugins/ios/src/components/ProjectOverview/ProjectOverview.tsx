import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CommentSection } from '../CommentSection';
import { ProjectInfo } from '../ProjectInfo';
import { ProjectFiles } from '../ProjectFiles';
import { ProjectDeleteDialog } from '../ProjectDeleteDialog';
import { StatusIndicator } from '../StatusIndicator'; 
import { GithubRepoPreview } from '../GithubRepoPreview';

type Props = {
  open: boolean;
  handleCloseDialog: () => void;
  project: any;
  project_id: string;
  entity_ref: string; // Add entity_ref to Props
};

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 0,
    maxHeight: '90vh',
    maxWidth: '90vw',
  },
}));

export const ProjectOverview = ({ open, handleCloseDialog, project, project_id, entity_ref }: Props) => {
  const classes = useStyles();
  const [isEditable, setIsEditable] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  if (!project) {
    return null;
  }

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirmed = () => {
    handleCloseDialog();
    handleCloseDeleteDialog();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      fullWidth
      PaperProps={{
        className: classes.paper,
      }}
    >
      <DialogTitle>Project Overview</DialogTitle>
      <DialogContent>
       
        <ProjectInfo
          project={project}
          entity_ref={entity_ref} // Pass entity_ref to ProjectInfo
          onDeleteClick={handleDeleteClick}
          fetchProjects={() => {}}
        />
        <GithubRepoPreview repoUrl={project.project_repository_link} />
        <CommentSection projectId={project.project_id} />
      </DialogContent>
      {openDeleteDialog && (
        <ProjectDeleteDialog
          project_id={project_id}
          onClose={handleCloseDeleteDialog}
          onDeleteConfirmed={handleDeleteConfirmed}
        />
      )}
    </Dialog>
  );
};
