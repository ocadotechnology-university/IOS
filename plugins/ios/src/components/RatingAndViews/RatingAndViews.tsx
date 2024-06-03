import React, { useEffect } from 'react';
import { Button, IconButton } from '@material-ui/core';
import { iosApiRef } from '../../api';
import { Comment, Reply, Member, Project } from '../../types';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import VisibilityIcon from '@material-ui/icons/Visibility';
import StarIcon from '@material-ui/icons/Star';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  viewsContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
  },
  viewText: {
    fontSize: '1.5rem',
    marginLeft: theme.spacing(1),
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
  },
  ratingText: {
    fontSize: '1.5rem',
    marginLeft: theme.spacing(1),
  },
  ratingButtons: {
    display: 'flex',
    flexDirection: 'column',
  },
  ratingButton: {
    marginLeft: theme.spacing(0.5),
  },
}));

export const RatingAndViews = ({ project }) => {
  const identity = useApi(identityApiRef);
  const classes = useStyles();
  const api = useApi(iosApiRef);
  const [views, setViews] = React.useState(project.project_views);
  const [rating, setRating] = React.useState(project.project_rating);

  const userEntityRef = identity.getUserId();

  useEffect(() => {
    const incrementViews = async () => {
      try {
        console.info('views', views)
        console.log("ent---------------------: ", userEntityRef);
        let user_views = await api.getUserViews("user:default/" + userEntityRef);
        user_views = user_views ?? [];
        console.log("views---------------------: ", user_views);
        if (Array.isArray(user_views)) {
          if (!user_views.includes(project.project_id)) {
            setViews(views + 1);
            try {
              await api.updateProjectViews(project.project_id, views + 1);
            } catch (error) {
              console.error('Error updating project views:', error);
            }
            try {
              await api.updateUserViewed("user:default/" + userEntityRef, project.project_id);
            } catch (error) {
              console.error('Error updating user viewed projects:', error);
            }
          }
        } else if (typeof user_views === 'number') {
          if (user_views !== project.project_id) {
            setViews(views + 1);
            try {
              await api.updateProjectViews(project.project_id, views + 1);
            } catch (error) {
              console.error('Error updating project views:', error);
            }
            try {
              await api.updateUserViewed("user:default/" + userEntityRef, project.project_id);
            } catch (error) {
              console.error('Error updating user viewed projects:', error);
            }
          }
        }
        
      } catch (error) {
        console.error('Error incrementing project views:', error);
      }
    };
    incrementViews();
  }, []);

  const refreshValues = async () => {
    try {
      const updatedProject = await api.getProjectByID(project.project_id);
      console.info('updated proj', updatedProject);
      setViews(updatedProject[0].project_views);
      setRating(updatedProject[0].project_rating);
    } catch (error) {
      console.error('Error fetching updated project values:', error);
    }
  };

  const handleIncreaseRating = async () => {
    try {
      await refreshValues();
      let user_rates = await api.getUserRates("user:default/" + userEntityRef);
      user_rates = user_rates ?? [];
      console.info("rates _____--------_____-----_____----: ", user_rates);
      let newRating = rating;
      if (Array.isArray(user_rates)) {
        if (!user_rates.includes(project.project_id)) {
          newRating = rating + 1;
          try {
            await api.updateUserRated("user:default/" + userEntityRef, project.project_id);
          } catch (error) {
            console.error('Error updating user rated project:', error);
          }
        } else if (user_rates.includes(project.project_id)) {
          newRating = rating - 1;
          try {
            await api.deleteUserRatedProjectId("user:default/" + userEntityRef, project.project_id);
          } catch (error) {
            console.error('Error deleting user rated project:', error);
          }
        }
      } else if (typeof user_rates === 'number') {
        if (user_rates !== project.project_id) {
          newRating = rating + 1;
          try {
            await api.updateUserRated("user:default/" + userEntityRef, project.project_id);
          } catch (error) {
            console.error('Error updating user rated project:', error);
          }
        } else if (user_rates === project.project_id) {
          newRating = rating - 1;
          try {
            await api.deleteUserRatedProjectId("user:default/" + userEntityRef, project.project_id);
          } catch (error) {
            console.error('Error deleting user rated project:', error);
          }
        }
      }
      
      try{
        await api.updateProjectRating(project.project_id, newRating);
      } catch {}
      await refreshValues();
    } catch (error) {
      console.error('Error increasing project rating:', error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.viewsContainer}>
        <VisibilityIcon />
        <span className={classes.viewText}>{views}</span>
      </div>
      <div className={classes.ratingContainer}>
        <StarIcon />
        <span className={classes.ratingText}>{rating}</span>
      </div>
        <IconButton
          size="small"
          color="primary"
          onClick={handleIncreaseRating}
          className={classes.ratingButton}
        >
          <ThumbUpIcon />
        </IconButton>
    </div>
  );
};
