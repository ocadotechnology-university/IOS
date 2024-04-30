import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import {
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

export const ExampleComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shouldRerender, setShouldRerender] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setShouldRerender((prev) => !prev); // Toggle to trigger re-render
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
          <Grid item>
            <ProjectComponent key={shouldRerender} /> {/* Key to re-render */}
          </Grid> 

          <Grid item>
            <Projects key={shouldRerender} /> {/* Key to re-render */}
          </Grid>

        </Grid>
        <AddProjectDialog 
          open={dialogOpen} 
          handleCloseDialog={handleCloseDialog} 
        />
      </Content>
    </Page>
  );
};
