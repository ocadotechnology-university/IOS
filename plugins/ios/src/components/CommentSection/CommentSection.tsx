import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, List, ListItem, ListItemText, Avatar, Grid, Paper, Divider, MenuItem, FormControl, InputLabel, Select } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
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
    gap: theme.spacing(1),
  },
  textField: {
    flex: 1,
  },
  button: {
    height: 'fit-content',
  },
}));

const imgLink = "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

export const CommentSection = ({ projectId }) => {
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const iosApi = useApi(iosApiRef);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const userEntities = await catalogApi.getEntities({
        filter: { kind: 'user' },
      });
      setUsers(userEntities.items);
    };

    const fetchComments = async () => {
      try {
        const comments = await iosApi.getComments(projectId);
        console.log("fdsafsa",comments);
        setComments(comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchUsers();
    fetchComments();
  }, [catalogApi, iosApi, projectId]);

  const handleCommentSubmit = async () => {
    
    const userEntity = users.find(user => user.metadata.uid === selectedUser);
    const userRef = stringifyEntityRef(userEntity);
    console.log('LOGLOG:', userRef, projectId, newComment); // Log the response for debugging
    await iosApi.insertComment(projectId, userRef, newComment);
    setNewComment(''); // Clear the comment input
    setSelectedUser(''); // Clear the selected user
    // Refresh comments after adding a new one
    const comments = await iosApi.getComments(projectId);
    setComments(comments);
    
    fetchComments();

  };

  return (
    <div className="App">
      <h1>Comments</h1>
      <Paper style={{ padding: "40px 20px" }}>
        {comments.map(comment => (
          <div key={comment.comment_id}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item>
                <Avatar alt="User Avatar" src={imgLink} />
              </Grid>
              <Grid justifyContent="left" item xs zeroMinWidth>
                <h4 style={{ margin: 0, textAlign: "left" }}>{comment.user_ref}</h4>
                <p style={{ textAlign: "left" }}>{comment.comment_text}</p>
                <p style={{ textAlign: "left", color: "gray" }}>posted {new Date(comment.comment_date).toLocaleString()}</p>
              </Grid>
            </Grid>
            <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
          </div>
        ))}
      </Paper>
      <Paper style={{ padding: "40px 20px", marginTop: 10 }}>
        <div className={classes.commentBox}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>User</InputLabel>
            <Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.map((user) => (
                <MenuItem key={user.metadata.uid} value={user.metadata.uid}>
                  {user.metadata.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
    </div>
  );
};
