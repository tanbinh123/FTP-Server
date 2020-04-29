import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import validate from 'validate.js';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Switch,
  Avatar,
  colors
} from '@material-ui/core';
import { DropzoneDialog } from 'material-ui-dropzone'
import axios from 'utils/axios';
import {useDropzone} from 'react-dropzone'

const useStyles = makeStyles(theme => ({
  root: {
    
  },
  formGroup: {
    marginBottom: theme.spacing(3)
  },
  fieldGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  textField: {
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  },
  actions: {
    backgroundColor: colors.grey[100],
    paddingTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-start'
  },
  avatar: {
    height: 72,
    width: 72,
    marginRight: theme.spacing(1)
  }
}));

const schema = {
  fullName: {
    presence: { allowEmpty: false, message: '^Nome é obrigatório' }
  }
};

const PersonForm = props => {
  const { person, onSubmit, className, ...rest } = props;

  const [formState, setFormState] = useState({
    isValid: false,
    values: { ...person },
    touched: {},
    errors: {}
  });

  const classes = useStyles();

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    onSubmit(formState.values);
  };

  const onDrop = useCallback(files => {
    const data = new FormData();
    data.append('file', files[0]);
    axios({
      method: 'POST',
      url: '/api/v1/person',
      data: data
    })
    .then(response => {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          thumbnail: response.data
        },
        touched: {
          ...formState.touched,
          thumbnail: true
        }
      }));
    }).catch((error) => {
    });
  }, [])
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <form
        {...rest}
        className={clsx(classes.root, className)}
        onSubmit={handleSubmit}
      >
      <Card
        {...rest}
        className={clsx(classes.root, className)}>
        <CardHeader title="Person Data" action={<Switch
            checked={formState.values.active}
            onChange={handleChange}
            name="active"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />} />
        <CardContent>
          <div className={classes.formGroup}>
            <div {...getRootProps({ refKey: 'innerRef' })} className={classes.avatar}>
              <Avatar 
                className={classes.avatar}
                src={formState.values.thumbnail ? formState.values.thumbnail.uri : ''}
              />
            </div>
           <input {...getInputProps()} />
          </div>
          <div className={classes.formGroup}>
            <TextField
              size="small"
              autoFocus
              fullWidth
              className={classes.textField}
              error={hasError('fullName')}
              helperText={hasError('fullName') ? formState.errors.fullName[0] : null}
              label="Nome"
              onChange={handleChange}
              name="fullName"
              value={formState.values.fullName}
              variant="outlined"
            /> 
            </div>
            <div>
              <TextField
              size="small"
              fullWidth
              className={classes.textField}
              error={hasError('personType')}
              helperText={hasError('personType') ? formState.errors.personType[0] : null}
              label="Type"
              onChange={handleChange}
              name="personType"
              value={formState.values.personType.displayName}
              variant="outlined"
            />
            </div>
            
         
          
        </CardContent>
      </Card>
      <div className={classes.actions}>
        <Button
          disabled={!formState.isValid}
          type="submit">
          Salvar alterações
        </Button>
      </div>
    </form>
  );
};

PersonForm.propTypes = {
  person: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default PersonForm;