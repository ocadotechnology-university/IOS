import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CommentSection } from '../CommentSection';
import { ProjectInfo } from '../ProjectInfo';
import { ProjectFiles } from '../ProjectFiles';
import { ProjectDeleteDialog } from '../ProjectDeleteDialog';
import { StatusIndicator } from '../StatusIndicator'; // Import the StatusIndicator component

type Props = {
  open: boolean;
  handleCloseDialog: () => void;
  project: any;
  project_id: string;
};

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 0,
    maxHeight: '90vh',
    maxWidth: '90vw',
  },
}));

export const ProjectOverview = ({ open, handleCloseDialog, project, project_id }: Props) => {
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
        <StatusIndicator status={project.status} /> {/* Add StatusIndicator here */}
        <ProjectInfo project={project} onDeleteClick={handleDeleteClick} />
        <ProjectFiles />
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
