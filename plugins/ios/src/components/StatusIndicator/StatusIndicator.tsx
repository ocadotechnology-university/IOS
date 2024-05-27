import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
    marginBottom: theme.spacing(2), // Ensure there is some margin
  },
  statusCircle: {
    width: 13,
    height: 13,
    borderRadius: '50%',
    marginRight: theme.spacing(1),
  },
  conceptualization: {
    backgroundColor: 'blue',
  },
  development: {
    backgroundColor: 'green',
  },
  onHold: {
    backgroundColor: 'orange',
  },
  launched: {
    backgroundColor: 'purple',
  },
  unsupported: {
    backgroundColor: 'red',
  },
}));

export const StatusIndicator = ({ project }) => {
  const classes = useStyles();

  const status = project.project_life_cycle_status;


  let statusClass;
  switch (status) {
    case 'Conceptualization':
      statusClass = classes.conceptualization;
      break;
    case 'Development':
      statusClass = classes.development;
      break;
    case 'On Hold':
      statusClass = classes.onHold;
      break;
    case 'Launched':
      statusClass = classes.launched;
      break;
    case 'Archived':
      statusClass = classes.unsupported;
      break;
    default:
      statusClass = '';
  }

  console.log('Applied class:', status);

  return (
    <div className={classes.statusIndicator}>
      <div className={`${classes.statusCircle} ${statusClass}`} />
      <span>{status}</span>
    </div>
  );
};