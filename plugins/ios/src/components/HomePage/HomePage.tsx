import React, { useState } from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { ProjectComponent } from '../ProjectTable';
import { AddProjectDialog } from '../AddCommentDialog/AddCommentDialog';
import { Projects } from '../ProjectItemCards';

interface CommentData {
  title: string;
  description: string;
}

export const ExampleComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmitComment = (title: string, description: string) => {
    console.log('Submitted comment:', { title, description });
  };

  return (
    <Page themeId="tool">
      <Header title="Welcome to ios!" subtitle="Sharing artifacts provider">
        <HeaderLabel label="Owner" value="Politechnika Wroclawska / Ocado Technology" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Internal Open Source Portal">
          <SupportButton>Sharing artifacts provider</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
              Add Project
            </Button>
          </Grid>
          {/* <Grid item>
            <ProjectComponent />
          </Grid> */}

          <Grid item>
            <Projects />
          </Grid>

        </Grid>
        <AddProjectDialog open={dialogOpen} onClose={handleCloseDialog} onSubmit={handleSubmitComment} />
      </Content>
    </Page>
  );
};
