import React from 'react';
import { Entity } from '@backstage/catalog-model';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  catalogEntities: Entity[];
  onChange: (entity: Entity) => void;
  disableClearable: boolean;
  defaultValue: Entity | null | undefined;
  label: string;
};

const useStyles = makeStyles({
  container: { width: '100%', minWidth: '22rem' },
  autocomplete: { overflow: 'hidden' },
});

export const ProjectSelector = ({
  catalogEntities,
  onChange,
  disableClearable,
  defaultValue,
  label,
}: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Autocomplete
        className={classes.autocomplete}
        fullWidth
        disableClearable={disableClearable}
        defaultValue={defaultValue}
        options={catalogEntities}
        getOptionLabel={option => option?.metadata?.name}
        renderOption={option => (
          <Typography component="span">{option?.metadata?.name}</Typography>
        )}
        renderInput={params => <TextField {...params} label={label} />}
        onChange={(_, data) => {
          onChange(data!);
        }}
      />
    </div>
  );
};