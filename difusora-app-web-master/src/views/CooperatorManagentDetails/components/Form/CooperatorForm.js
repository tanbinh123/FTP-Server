import React, { useState, useEffect } from 'react';
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
  Switch,
  colors,
  Chip,
  Avatar,
  Tab, 
  Tabs, 
  Divider
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { debounce } from "throttle-debounce";
import axios from 'utils/axios';
import getInitials from 'utils/getInitials';

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
  }
}));

const schema = {
  fullName: {
    presence: { allowEmpty: false, message: '^Nome é obrigatório' }
  },
  register: {
    presence: { allowEmpty: false, message: '^Registro é obrigatório' }
  }
};

const CooperatorForm = props => {
  const { cooperator, onSubmit, className, ...rest } = props;

  const [formState, setFormState] = useState({
    isValid: false,
    values: { ...cooperator },
    touched: {},
    errors: {}
  });

  const [services, setServices] = React.useState([]);
  const [servicesIsLoading, setServicesIsLoading] = React.useState(false);

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

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleServicesChange = async (event, newValue) => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        services: newValue
      },
      touched: {
        ...formState.touched,
        services: true
      }
    }));
  };

  const searchServices = debounce(500, (value) => {
    axios.get(`/v1/service?description=${value}&size=10`).then(response => {
      setServices(response.data.content);
      setServicesIsLoading(false);
    }).catch((error) => {
      setServices([]);
    }).finally(() => {
      setServicesIsLoading(false);
    });
  });
  
  const queryServices = value => {
    setServicesIsLoading(true);
    searchServices(value);
  };

  return (
    <form
        {...rest}
        className={clsx(classes.root, className)}
        onSubmit={handleSubmit}
      >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
        >
        <CardHeader title="Dados do colaborador" action={<Switch
            checked={formState.values.active}
            onChange={handleChange}
            name="active"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />} />
        <CardContent>
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
          <div className={classes.formGroup}>
            <TextField
              size="small"
              fullWidth
              className={classes.textField}
              error={hasError('shortName')}
              helperText={hasError('shortName') ? formState.errors.shortName[0] : null}
              label="Nome curto"
              onChange={handleChange}
              name="shortName"
              value={formState.values.shortName}
              variant="outlined"
            />
          </div>
          <div className={classes.formGroup}>
            <TextField
              size="small"
              className={classes.textField}
              error={hasError('register')}
              helperText={hasError('register') ? formState.errors.register[0] : null}
              label="Registro"
              onChange={handleChange}
              name="register"
              value={formState.values.register}
              variant="outlined"
            />
          </div>
          <div className={classes.formGroup}>
            <TextField
              size="small"
              fullWidth
              multiline
              className={classes.textField}
              helperText={`${255 - (formState.values.annotation ? formState.values.annotation.length : 0)} caracteres restantes`}
              label="Anotação"
              onChange={handleChange}
              name="annotation"
              value={formState.values.annotation}
              variant="outlined"
              rows={3}
            />
          </div>
          <div className={classes.formGroup}>
            <Autocomplete
              size="small"
              multiple
              loading={servicesIsLoading}
              loadingText="Aguarde um momento..."
              noOptionsText="Nada foi encontrado"
              options={services}
              value={formState.values.services} 
              onChange={handleServicesChange}
              onOpen={() => queryServices('')}
              getOptionLabel={option => option.description ? option.description : ''}
              includeInputInList
              renderInput={params => (
                <TextField
                  {...params}
                  name="type"
                  error={hasError('type')}
                  helperText={hasError('type') ? formState.errors.type[0] : null}
                  label="Serviços"
                  variant="outlined"
                  fullWidth
                  onChange={({target}) => queryServices(target.value)}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.description}
                    avatar={
                      <Avatar src={option.thumbnail} >
                        {getInitials(option.description)}
                      </Avatar>
                    }
                    {...getTagProps({ index })}
                  />
                ))
              }
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

CooperatorForm.propTypes = {
  cooperator: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default CooperatorForm;