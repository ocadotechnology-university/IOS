import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
  },
  statusCircle: {
    width: 10,
    height: 10,
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

export const StatusIndicator = ({ status }) => {
  const classes = useStyles();

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
    case 'Unsupported/End-of-Life':
      statusClass = classes.unsupported;
      break;
    default:
      statusClass = '';
  }

  return (
    <div className={classes.statusIndicator}>
      <div className={`${classes.statusCircle} ${statusClass}`} />
      <span>{status}</span>
    </div>
  );
};
