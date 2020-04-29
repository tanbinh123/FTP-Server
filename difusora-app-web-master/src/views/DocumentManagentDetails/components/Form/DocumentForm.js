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
  documentName: {
    presence: { allowEmpty: false, message: '^Nome é obrigatório' }
  }
};

const DocumentForm = props => {
  const { document, onSubmit, className, ...rest } = props;

  const [formState, setFormState] = useState({
    isValid: false,
    values: { ...document },
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
      url: '/api/v1/document',
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
        <CardHeader title="Document info" action={<Switch
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
              error={hasError('documentName')}
              helperText={hasError('documentName') ? formState.errors.documentName[0] : null}
              label="Nome"
              onChange={handleChange}
              name="documentName"
              value={formState.values.documentName}
              variant="outlined"
            />
          </div>
          <div>
              <TextField
              size="small"
              fullWidth
              className={classes.textField}
              error={hasError('documentType')}
              helperText={hasError('documentType') ? formState.errors.documentType[0] : null}
              label="Type"
              onChange={handleChange}
              name="documentType"
              value={formState.values.documentType.displayName}
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

DocumentForm.propTypes = {
  document: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default DocumentForm;