import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Divider,
  Grid,
  Paper,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';
import { iosApiRef } from '../../api'; 
import { Comment, Reply, Member } from '../../types';

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
  showbut: {
    height: 20,
    width: 120,
  },
}));


const defaultImgLink = "https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg";

export const CommentSection = ({ projectId }: { projectId: number }) => {

  const classes = useStyles();
  const api = useApi(iosApiRef);
  const identity = useApi(identityApiRef);
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replies, setReplies] = useState<{ [key: number]: Reply[] }>({});
  const [newReplies, setNewReplies] = useState<{ [key: number]: string }>({});
  const [showReplies, setShowReplies] = useState<{ [key: number]: boolean }>({});
  const [users, setUsers] = useState<{ [key: string]: Member }>({});
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const [projectVersion, setProjectVersion] = useState<string>('');
  const [filterByVersion, setFilterByVersion] = useState<boolean>(false);

  const userEntityRef = identity.getUserId();

  

  const fetchDisplayNames = async (userRefs: string[]) => {
    const names = await Promise.all(
      userRefs.map(async userRef => {
        const profile = await identity.getProfileInfo({ userId: userRef });
        return { userRef, displayName: profile.displayName || 'Unknown User' };
      })
    );
    const namesMap = names.reduce((acc, { userRef, displayName }) => {
      acc[userRef] = displayName;
      return acc;
    }, {} as { [key: string]: string });
    setUserNames(prevNames => ({ ...prevNames, ...namesMap }));
  };

  useEffect(() => {
    const fetchProjectVersion = async () => {
      try {
        const projectArray = await api.getProjectByID(projectId);
        if (projectArray && projectArray.length > 0) {
          const project = projectArray[0];
          setProjectVersion(project.project_version);
        }
      } catch (error) {
        console.error('Failed to fetch project version', error);
      }
    };

    const fetchComments = async () => {
      try {
        const fetchedComments = await api.getComments(projectId);
        // Filter out comments that have a comment_id_ref
        const topLevelComments = fetchedComments.filter(comment => comment.comment_id_ref === null);
        topLevelComments.sort((a, b) => new Date(b.comment_date).getTime() - new Date(a.comment_date).getTime());
        setComments(topLevelComments);
        setFilteredComments(topLevelComments);

        // Fetch user data for each comment
        const userRefs = Array.from(new Set(topLevelComments.map(comment => comment.user_id_ref)));
        await fetchDisplayNames(userRefs);

        const userData = await Promise.all(userRefs.map(userRef => api.getUserData(userRef)));
        const usersMap = userData.reduce((acc, memberArray) => {
          const member = memberArray[0];
          acc[member.user_entity_ref] = member;
          return acc;
        }, {} as { [key: string]: Member });
        setUsers(usersMap);
      } catch (error) {
        console.error('Failed to fetch comments or user data', error);
      }
    };

    fetchProjectVersion();
    fetchComments();
  }, [api, projectId]);

  const handleAddComment = async () => {
    try {
      await api.insertComment(projectId, null, userEntityRef, newComment); // comment_id_ref is null for top-level comments
    } catch (error) {
      console.error('Failed to add comment', error);
    } finally {
      setNewComment('');
      try {
        const updatedComments = await api.getComments(projectId);
        // Filter out comments that have a comment_id_ref
        const topLevelComments = updatedComments.filter(comment => comment.comment_id_ref === null);
        topLevelComments.sort((a, b) => new Date(b.comment_date).getTime() - new Date(a.comment_date).getTime());
        setComments(topLevelComments);
        setFilteredComments(topLevelComments);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    }
  };

  const handleAddReply = async (commentId: number) => {
    if (newReplies[commentId]) {
      try {
        await api.insertComment(projectId, commentId, userEntityRef, newReplies[commentId]); // comment_id_ref is the parent comment's ID
      } catch (error) {
        console.error('Failed to add reply', error);
      } finally {
        setNewReplies({ ...newReplies, [commentId]: '' });
        try {
          const updatedReplies = await api.getReplies(commentId);
          setReplies({ ...replies, [commentId]: updatedReplies });

          const userRefs = Array.from(new Set(updatedReplies.map(reply => reply.user_id_ref)));
          await fetchDisplayNames(userRefs);
        } catch (error) {
          console.error('Failed to fetch replies', error);
        }
      }
    }
  };

  const fetchReplies = async (commentId: number) => {
    try {
      const fetchedReplies = await api.getReplies(commentId);
      setReplies({ ...replies, [commentId]: fetchedReplies });
      setShowReplies({ ...showReplies, [commentId]: !showReplies[commentId] });

      // Fetch user data for each reply
      const userRefs = Array.from(new Set(fetchedReplies.map(reply => reply.user_id_ref)));
      await fetchDisplayNames(userRefs);

      const userData = await Promise.all(userRefs.map(userRef => api.getUserData(userRef)));
      const usersMap = userData.reduce((acc, memberArray) => {
        const member = memberArray[0];
        acc[member.user_entity_ref] = member;
        return acc;
      }, { ...users });
      setUsers(usersMap);
    } catch (error) {
      console.error('Failed to fetch replies or user data', error);
    }
  };

  const toggleFilterByVersion = () => {
    setFilterByVersion(!filterByVersion);
    if (!filterByVersion) {
      const filtered = comments.filter(comment => comment.comment_version === projectVersion);
      setFilteredComments(filtered);
    } else {
      setFilteredComments(comments);
    }
  };

  return (
    <div style={{ padding: 14 }} className="App">
      <h1>Comments</h1>
      <Grid container justifyContent="flex-end" alignItems="center" style={{ marginBottom: '10px' }}>
        <Grid item>
          <Button
            variant="text"
            color="primary"
            onClick={toggleFilterByVersion}
            size="small"
          >
            {filterByVersion ? 'All Comments' : `Comments for Current Version`}
          </Button>
        </Grid>
      </Grid>
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
            onClick={handleAddComment}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </div>
      </Paper>
      <Paper style={{ padding: '40px 20px' }}>
        {filteredComments.map((comment) => {
          const user = users[comment.user_id_ref] || {};
          const displayName = userNames[comment.user_id_ref] || 'User';

          return (
            <div key={comment.comment_id}>
              <Grid container wrap="nowrap" spacing={2}>
                <Grid item>
                  <Avatar alt="User Avatar" src={user.user_avatar || defaultImgLink} />
                </Grid>
                <Grid item xs zeroMinWidth>
                  <h4 style={{ margin: 0, textAlign: 'left' }}>{displayName}</h4>
                  <p style={{ textAlign: 'left' }}>{comment.comment_text}</p>
                  <p style={{ textAlign: 'left', color: 'gray' }}>
                    posted {new Date(comment.comment_date).toLocaleString()}&nbsp;&nbsp;for version {comment.comment_version}
                  </p>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => fetchReplies(comment.comment_id)}
                  >
                    {showReplies[comment.comment_id] ? 'Hide Replies' : 'Replies'}
                  </Button>
                  {showReplies[comment.comment_id] && (
                    <>
                      {replies[comment.comment_id] && replies[comment.comment_id].map((reply) => {
                        const replyUser = users[reply.user_id_ref] || {};
                        const replyDisplayName = userNames[reply.user_id_ref] || 'Loading...';

                        return (
                          <div key={reply.comment_id} style={{ marginLeft: '20px' }}>
                            <Grid container wrap="nowrap" spacing={2}>
                              <Grid item>
                                <Avatar alt="User Avatar" src={replyUser.user_avatar || defaultImgLink} />
                              </Grid>
                              <Grid item xs zeroMinWidth>
                                <h5 style={{ margin: 0, textAlign: 'left' }}>{replyDisplayName}</h5>
                                <p style={{ textAlign: 'left' }}>{reply.comment_text}</p>
                                <p style={{ textAlign: 'left', color: 'gray' }}>
                                  posted {new Date(reply.comment_date).toLocaleString()}&nbsp;&nbsp;for version {reply.comment_version}
                                </p>
                              </Grid>
                            </Grid>
                          </div>
                        );
                      })}
                      <div className={classes.commentBox}>
                      <TextField
                        multiline
                        className={classes.textField}
                        value={newReplies[comment.comment_id] || ''}
                        onChange={(e) =>
                          setNewReplies({ ...newReplies, [comment.comment_id]: e.target.value })
                        }
                        variant="outlined"
                        label="Add a reply"
                      />
                      <Button
                        className={classes.button}
                        onClick={() => handleAddReply(comment.comment_id)}
                        variant="contained"
                        color="primary"
                      >
                        Add
                      </Button>
                      </div>
                    </>
                  )}
                </Grid>
              </Grid>
              <Divider variant="fullWidth" style={{ margin: '30px 0' }} />
            </div>
          );
        })}
      </Paper>
    </div>
  );
};