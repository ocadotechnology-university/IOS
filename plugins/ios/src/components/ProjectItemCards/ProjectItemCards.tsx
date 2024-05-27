import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  CardActions,
  Tab,
  Table,
  TablePagination,
} from '@material-ui/core';
import { ItemCardGrid, ItemCardHeader } from '@backstage/core-components';
import { useApi, alertApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { iosApiRef } from '../../api';
import { makeStyles } from '@material-ui/core/styles';
import { UpdateProjectDialog } from '../UpdateProjectDialog';
import { ProjectOverview } from '../ProjectOverview';
import SearchBar from 'material-ui-search-bar';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  card: {
    maxWidth: '800px',
    minWidth: '300px',
    minHeight: '200px',
    maxHeight: '500px',
    cursor: 'pointer', 
  },
  description: {
    wordWrap: 'break-word', 
  },
  noRecords: {
    textAlign: 'center',
    padding: '20px',
  },
  search: {
    marginBottom: '20px',
    width: '315px',
  },
  searchContainer: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  pagination: {
    marginTop: '1rem',
    marginLeft: 'auto',
    marginRight: '0',
  },
});

export const Projects = () => {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const iosApi = useApi(iosApiRef);
  const alertApi = useApi(alertApiRef);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [openProjectOverview, setOpenProjectOverview] = useState(false);

  const fetchProjects = async () => {
    try {
      const projectData = await iosApi.getProjects();
      setProjects(projectData);
      setFilteredProjects(projectData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!openProjectOverview) {
      fetchProjects();
    }
  }, [openProjectOverview]);

  useEffect(() => {
    setPage(0);
    const filtered = projects.filter((project) =>
        project.project_title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredProjects(filtered);
  },[searchValue, projects]);

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setSelectedProjectId(project.project_id);
    setOpenProjectOverview(true);

  };

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProjects = filteredProjects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <div className={classes.searchContainer}>
        <SearchBar
          className={classes.search}
          value={searchValue}
          onChange={(newValue) => setSearchValue(newValue)}
          onCancelSearch={() => setSearchValue('')}
        />
      </div>
      {paginatedProjects.length > 0 ? (
        <>  
          <ItemCardGrid className={classes.grid}>
            {paginatedProjects.map((project) => (
              <div
                key={project.project_title}
                className={classes.card}
                onClick={() => handleViewProject(project)}
              >
                <Card>
                  <CardMedia>
                    <ItemCardHeader
                      title={project.project_title}
                      subtitle={project.project_manager_username}
                    />
                  </CardMedia>
                  <CardContent>
                    <Typography variant="body2" className={classes.description}>
                      {project.project_description}
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <Typography variant="body2">
                      {project.project_team_owner_name}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
        </ItemCardGrid>
        <TablePagination
          component="div"
          className={classes.pagination}
          rowsPerPageOptions={[ 10, 15, 20, 30]}
          count={filteredProjects.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
        </>    
      ) : (
        <div className={classes.noRecords}>
          <Typography variant="body2">No records to display</Typography>
        </div>
      )}

      <ProjectOverview
        open={openProjectOverview}
        handleCloseDialog={() => setOpenProjectOverview(false)}
        project={selectedProject}
        project_id={selectedProjectId}
      />
    </>
  );
};