import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Avatar, Grid, Paper, Divider } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { identityApiRef } from '@backstage/core-plugin-api';
import { iosApiRef } from '../../api';
import { stringifyEntityRef } from '@backstage/catalog-model';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  commentBox: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  textField: {
    flex: 1,
  },
  button: {
    height: 60,
    width: 60,
  },
}));

const defaultImgLink = "https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg";

export const CommentSection = ({ projectId }) => {
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const identityApi = useApi(identityApiRef);
  const iosApi = useApi(iosApiRef);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const fetchUserAndComments = async () => {
      try {
        // Fetch the current user identity
        const { userEntityRef } = await identityApi.getBackstageIdentity();
        setSelectedUser(userEntityRef);

        // Fetch comments and user data
        await fetchComments();
      } catch (error) {
        console.error('Error fetching user or comments:', error);
      }
    };

    fetchUserAndComments();
  }, [catalogApi, identityApi, iosApi, projectId]);

  const fetchComments = async () => {
    try {
      const comments = await iosApi.getComments(projectId);
      console.log('Fetched comments:', comments);  // Log the fetched comments

      // Fetch user data for each comment
      const commentsWithUserData = await Promise.all(
        comments.map(async (comment) => {
          try {
            console.log('Fetching user data for:', comment.user_id_ref);
            const userEntity = await catalogApi.getEntityByRef(comment.user_id_ref);
            const userDataArray = await iosApi.getUserData(comment.user_id_ref);
            const userData = userDataArray[0];  // Extract the first element if it's an array
            console.log('Fetched user data:', userData);  // Log the fetched user data
            return {
              ...comment,
              user_avatar: userData.user_avatar || defaultImgLink,
              user_name: userEntity.metadata.name || 'Unknown User',
            };
          } catch (error) {
            console.error('Error fetching user data for comment:', comment.user_id_ref, error);
            return {
              ...comment,
              user_avatar: defaultImgLink, // Fallback if no avatar is found
              user_name: 'Unknown User',
            };
          }
        })
      );

      setComments(commentsWithUserData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      console.log('comentSub');
      const userEntity = await catalogApi.getEntityByRef(selectedUser);
      const userRef = stringifyEntityRef(userEntity);
      console.log('LOGLOG:', userRef, projectId, newComment); // Log the response for debugging
      await iosApi.insertComment(projectId, userRef, newComment);
      // Refresh comments after adding a new one
    } catch (error) {
      console.error('Error submitting comment:', error);
    }

    try {
      console.log('fetch');
      setNewComment(''); // Clear the comment input
      await fetchComments();
    } catch (error) {
      console.error('Error await fetch comment:', error);
    }
    
  };

  return (
    <div className="App">
      <h1 style={{ fontSize: "30px" }} >Comments</h1>
      <Paper style={{ padding: "40px 20px", marginTop: 10 }}>
        <div className={classes.commentBox}>
          <TextField
            className={classes.textField}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            variant="outlined"
            label="Add a comment"
          />
          <Button
            className={classes.button}
            onClick={handleCommentSubmit}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </div>
      </Paper>
      <Paper style={{ padding: "40px 20px" }}>
        {comments.map(comment => (
          <div key={comment.comment_id}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item>
                <Avatar alt="User Avatar" src={comment.user_avatar || defaultImgLink} />
              </Grid>
              <Grid item xs zeroMinWidth>
                <h4 style={{ margin: 0, textAlign: "left" }}>{comment.user_name}</h4>
                <p style={{ textAlign: "left" }}>{comment.comment_text}</p>
                <p style={{ textAlign: "left", color: "gray" }}>
                  posted {new Date(comment.comment_date).toLocaleString()}&nbsp;&nbsp;for version {comment.comment_version}
                </p>
              </Grid>
            </Grid>
            <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
          </div>
        ))}
      </Paper>

    </div>
  );
};