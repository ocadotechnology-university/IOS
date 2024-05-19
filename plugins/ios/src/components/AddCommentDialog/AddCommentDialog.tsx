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
import { iosApiRef } from '../../api';
import { ProjectSelector } from '../ProjectSelector';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';

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
  const [entity_ref, setEntityRef] = useState('');
  const [project_description, setProjectDescription] = useState('');
  const [project_manager_username, setProjectManagerUsername] = useState('');
  const [project_manager_ref, setProjectManagerRef] = useState('');
  const [project_docs_ref, setProjectDocsRef] = useState('');
  const [project_life_cycle_status, setProjectLifeCycleStatus] = useState('');
  const [project_team_owner_name, setProjectTeamOwnerName] = useState('');
  const [project_team_owner_ref, setProjectTeamOwnerRef] = useState('');
  const [project_version, setProjectVersion] = useState('');

  const project_rating = 0;
  const project_views = 0;

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [catalogEntities, setCatalogEntities] = useState([]); // New state for catalog entities
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

    const fetchCatalogEntities = async () => {
      const entities = await catalogApi.getEntities({
        filter:  { kind: 'component'}
      });
      setCatalogEntities(entities.items);
    };

    fetchUsersAndGroups();
    fetchCatalogEntities();
  }, [catalogApi]);

  
  useEffect(() => {
    console.log('Selected entity reference:', entity_ref);
  }, [entity_ref]);

  const isValidUrl = (url) => {
    const urlPattern = /^https?:\/\/.*$/;
    return urlPattern.test(url);
  };

  const hasError = (url) => {
    return !!(url && !isValidUrl(url)); // Return boolean
  };

  const isFormValid = () => {
    return (
      project_title &&
      project_description &&
      project_manager_username &&
      project_team_owner_name &&
      project_life_cycle_status &&
      entity_ref &&  // Ensure entity_ref is included in the validation
      (!project_manager_ref || isValidUrl(project_manager_ref)) &&
      (!project_docs_ref || isValidUrl(project_docs_ref)) &&
      isValidUrl(project_team_owner_ref)
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      console.error('Invalid form data');
      return;
    }

    console.log('Form data:', {
      project_title,
      entity_ref,
      project_description,
      project_manager_username,
      project_manager_ref,
      project_docs_ref,
      project_life_cycle_status,
      project_team_owner_name,
      project_team_owner_ref,
      project_rating,
      project_views,
      project_version,
    });

    try {
      await iosApi.insertProject(
        project_title,
        entity_ref,
        project_description,
        project_manager_username,
        project_manager_ref,
        project_docs_ref,
        project_life_cycle_status,
        project_team_owner_name,
        project_team_owner_ref,
        project_rating,
        project_views,
        project_version
      );
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding project:', error);
    } finally {
      handleCloseDialog();
    }
  };

  const handleEntityClick = (entity: Entity) => {
    const entityReference = stringifyEntityRef(entity);
    setEntityRef(entityReference);
    console.log('Selected entity reference:', entityReference);
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>Add Project</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          label="Project Title"
          value={project_title}
          onChange={(e) => setProjectTitle(e.target.value)}
          margin="normal"
          required
        />
        <ProjectSelector
          catalogEntities={catalogEntities}
          onChange={handleEntityClick}
          disableClearable={true}
          defaultValue={ null}
          label="Select Project Entity"
        />
        <TextField
          label="Description"
          value={project_description}
          onChange={(e) => setProjectDescription(e.target.value)}
          multiline
          rows={4}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Project Manager</InputLabel>
          <Select
            value={project_manager_username}
            onChange={(e) => setProjectManagerUsername(e.target.value)}
          >
            {users.map((user) => (
              <MenuItem key={user.metadata.uid} value={user.metadata.name}>
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
          error={hasError(project_manager_ref)} // Pass boolean
          helperText={hasError(project_manager_ref) ? 'Not a valid URL' : ''}
        />
        <TextField
          label="Docs Link"
          value={project_docs_ref}
          onChange={(e) => setProjectDocsRef(e.target.value)}
          multiline
          rows={2}
          margin="normal"
          error={hasError(project_docs_ref)} // Pass boolean
          helperText={hasError(project_docs_ref) ? 'Not a valid URL' : ''}
        />
        <TextField
          label="Project Team Owner Name"
          value={project_team_owner_name}
          onChange={(e) => setProjectTeamOwnerName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="Team Owner Link"
          value={project_team_owner_ref}
          onChange={(e) => setProjectTeamOwnerRef(e.target.value)}
          multiline
          rows={2}
          margin="normal"
          error={hasError(project_team_owner_ref)} // Pass boolean
          helperText={hasError(project_team_owner_ref) ? 'Not a valid URL' : ''}
        />
        <TextField
          label="Version"
          value={project_version}
          onChange={(e) => setProjectVersion(e.target.value)}
          margin="normal"
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Lifecycle Status</InputLabel>
          <Select
            value={project_life_cycle_status}
            onChange={(e) => setProjectLifeCycleStatus(e.target.value)}
          >
            <MenuItem value="Planning">Planning</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={!isFormValid()}>
          Add Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};
