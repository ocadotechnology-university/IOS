import React, { useEffect, useState } from 'react';
import { Grid, Button, IconButton } from '@material-ui/core';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import AppsIcon from '@material-ui/icons/Apps';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { ProjectTable } from '../ProjectTable';
import { AddProjectDialog } from '../AddCommentDialog/AddCommentDialog';
import { Projects } from '../ProjectItemCards';
import { iosApiRef } from '../../api';
import { useApi,identityApiRef } from '@backstage/core-plugin-api';
import useAsyncFn from 'react-use/esm/useAsyncFn';

export const ExampleComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shouldRerender, setShouldRerender] = useState(false);
  const iosApi = useApi(iosApiRef);
  const identity = useApi(identityApiRef);
  // Read from localStorage
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem('viewType'); 
    return savedView ? savedView : 'list'; 
  });


  const [userId, fetchUserId] = useAsyncFn(async () => {
    return await (
      await identity.getProfileInfo()
    ).displayName;
  });


  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);
  
  useEffect(() => {
    localStorage.setItem('viewType', currentView); 
  }, [currentView]); 



  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setShouldRerender((prev) => !prev);
  };

  const switchToListView = () => {
    setCurrentView('list'); 
  };

  const switchToCardView = () => {
    setCurrentView('card'); 
  };

  return (
    <Page themeId="tool">
      <Header title="Welcome to iOS!" subtitle="Sharing artifacts provider">
        <HeaderLabel label="Owner" value="Politechnika Wroclawska / Ocado Technology" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>

      <Content>
        <ContentHeader title="Internal Open Source Portal">
          <SupportButton>Sharing artifacts provider</SupportButton>
        </ContentHeader>

        <Grid container spacing={3} justifyContent="flex-end">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
            >
              Add Project
            </Button>
          </Grid>

          <Grid item>
            <IconButton
              aria-label="List View"
              size="small"
              color={currentView === 'list' ? 'primary' : 'default'} // Conditional color
              onClick={switchToListView}
            >
              <ViewHeadlineIcon />
            </IconButton>
          </Grid>

          <Grid item>
            <IconButton
              aria-label="Card View"
              size="small"
              color={currentView === 'card' ? 'primary' : 'default'} // Conditional color
              onClick={switchToCardView}
            >
              <AppsIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Grid container spacing={3} direction="column">
          {currentView === 'list' ? (
            <Grid item>
              <ProjectTable key={shouldRerender} />
            </Grid>
          ) : (
            <Grid item>
              <Projects key={shouldRerender} />
            </Grid>
          )}
        </Grid>

        <AddProjectDialog
          open={dialogOpen}
          handleCloseDialog={handleCloseDialog}
        />
      </Content>
    </Page>
  );
};
