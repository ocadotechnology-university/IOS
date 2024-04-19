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
import { CommentComponent } from '../CommentTable';
import { AddCommentDialog } from '../AddCommentDialog/AddCommentDialog';

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
      <Header title="Welcome to ios!" subtitle="Optional subtitle">
        <HeaderLabel label="Owner" value="Politechnika Wroclawksa" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Internal Open Source Portal">
          <SupportButton>Sharing artifacts provider</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard title="Information card">
              <Typography variant="body1">
                All content should be wrapped in a card like this.
              </Typography>
            </InfoCard>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
              Add Comment
            </Button>
          </Grid>
          <Grid item>
            <CommentComponent />
          </Grid>
        </Grid>
        <AddCommentDialog open={dialogOpen} onClose={handleCloseDialog} onSubmit={handleSubmitComment} />
      </Content>
    </Page>
  );
};
