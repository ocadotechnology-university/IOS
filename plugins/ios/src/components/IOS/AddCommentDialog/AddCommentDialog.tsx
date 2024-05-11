import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { iosApiRef } from '../../../api';
const useStyles = makeStyles({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
});

type Props = {
  open: boolean;
  handleCloseDialog: () => void;
};

export const AddProjectDialog = ({ open, handleCloseDialog }: Props) => {
  const classes = useStyles();

  const [project_title, setProjectTitle] = useState('');
  const [project_description, setProjectDescription] = useState('');
  const [project_manager_username, setProjectManagerUsername] = useState('');
  const [project_manager_ref, setProjectManagerRef] = useState('');
  const [project_docs_ref, setProjectDocsRef] = useState('');
  const [project_life_cycle_status, setProjectLifeCycleStatus] = useState('');
  const [project_team_owner_name, setProjectTeamOwnerName] = useState('');
  const [project_team_owner_ref, setProjectTeamOwnerRef] = useState('');

  const project_rating = 0;
  const project_views = 0;
  const project_start_date = new Date();

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const catalogApi = useApi(catalogApiRef);
  const iosApi = useApi(iosApiRef);

  useEffect(() => {
    const fetchUsersAndGroups = async () => {
      const userEntities = await catalogApi.getEntities({
        filter: { kind: 'user' },
      });
      const groupEntities = await catalogApi.getEntities({
        filter: { kind: 'group' },
      });

      setUsers(userEntities.items);
      setGroups(groupEntities.items);
    };

    fetchUsersAndGroups();
  }, [catalogApi]);


  const handleSubmit = async () => {
    try {
      await iosApi.insertProject(
        project_title, 
        project_description, 
        project_manager_username, 
        project_manager_ref,
        project_docs_ref,
        project_life_cycle_status,
        project_team_owner_name,
        project_team_owner_ref,
        project_rating,
        project_views,
        project_start_date,
      );
      handleCloseDialog(); 
    } catch (error) {
      console.error('Error adding project:', error);
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
      <DialogTitle>Add Project</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          label="Project Title"
          value={project_title}
          onChange={(e) => setProjectTitle(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="Description"
          value={project_description}
          onChange={(e) => setProjectDescription(e.target.value)}
          multiline
          rows={4}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Project Manager</InputLabel>
          <Select
            value={project_manager_username}
            onChange={(e) => setProjectManagerUsername(e.target.value)}
          >
            {users.map((user) => (
              <MenuItem
                key={user.metadata.uid}
                value={user.metadata.name}
              >
                {user.metadata.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Manager Link"
          value={project_manager_ref}
          onChange={(e) => setProjectManagerRef(e.target.value)}
          multiline
          rows={2}
          margin="normal"
        />
        
        <TextField
          label="Docs Link"
          value={project_docs_ref}
          onChange={(e) => setProjectDocsRef(e.target.value)}
          multiline
          rows={2}
          margin="normal"
        />

        <TextField
          label="Life Cycle"
          value={project_life_cycle_status}
          onChange={(e) => setProjectLifeCycleStatus(e.target.value)}
          multiline
          rows={2}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Team Owner</InputLabel>
          <Select
            value={project_team_owner_name}
            onChange={(e) => setProjectTeamOwnerName(e.target.value)}
          >
            {groups.map((group) => (
              <MenuItem
                key={group.metadata.uid}
                value={group.metadata.name}
              >
                {group.metadata.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <TextField
          label="Team"
          value={project_team_owner_name}
          onChange={(e) => setProjectTeamOwnerName(e.target.value)}
          multiline
          rows={2}
          margin="normal"
        />

        <TextField
          label="Team Link"
          value={project_team_owner_ref}
          onChange={(e) => setProjectTeamOwnerRef(e.target.value)}
          multiline
          rows={2}
          margin="normal"
        />

        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
        <Button onClick={handleCloseDialog} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
