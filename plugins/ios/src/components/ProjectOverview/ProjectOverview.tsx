import React, { useState } from 'react';
import {  Dialog, DialogTitle, DialogContent, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CommentSection } from '../CommentSection';
import { ProjectInfo } from '../ProjectInfo';
import { ProjectFiles } from '../ProjectFiles';

type Props = {
  open: boolean;
  handleCloseDialog: () => void;
  project: any;
  project_id: number;
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
  const [isEditable, setIsEditable] = useState(false); // State to track edit mode

  const handleEditClick = () => {
    setIsEditable(true); // Set edit mode to true
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
        <ProjectInfo project={project} project_id={project_id}  />
        <ProjectFiles/>
        <CommentSection />
      </DialogContent>
    </Dialog>
  );
};

