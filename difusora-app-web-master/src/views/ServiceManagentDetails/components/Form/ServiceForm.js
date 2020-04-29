import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import validate from 'validate.js';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import axios from 'utils/axios';
import {
  Button,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Switch,
  colors
} from '@material-ui/core';
import { debounce } from "throttle-debounce";
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
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
  description: {
    presence: { allowEmpty: false, message: '^Descrição é obrigatória' }
  },
  type: {
    presence: { allowEmpty: false, message: '^Tipo é obrigatória' }
  }
};

const ServiceForm = props => {
  const { service, onSubmit, className, ...rest } = props;

  const [serviceTypes, setServiceTypes] = React.useState([]);
  const [serviceTypesIsLoading, setServiceTypesIsLoading] = React.useState(false);

  const [formState, setFormState] = useState({
    isValid: false,
    values: { ...service },
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

  const handleServiceTypeChange = async (event, newValue) => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        type: newValue
      },
      touched: {
        ...formState.touched,
        type: true
      }
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    formState.values.type = formState.values.type ? formState.values.type.id : null;
    onSubmit(formState.values);
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const searchServiceType = debounce(500, (value) => {
    axios.get(`/v1/service-type?description=${value}&size=10`).then(response => {
      setServiceTypes(response.data.content);
      setServiceTypesIsLoading(false);
    }).catch((error) => {
      setServiceTypes([]);
      setServiceTypesIsLoading(false);
    });
  });

  const queryServiceType = value => {
    setServiceTypesIsLoading(true);
    searchServiceType(value);
  };

  return (
    <form
        {...rest}
        className={clsx(classes.root, className)}
        onSubmit={handleSubmit}
      >
      <Card>
        <CardHeader title="Dados do serviço" action={<Switch
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
                error={hasError('description')}
                helperText={hasError('description') ? formState.errors.description[0] : null}
                label="Descrição"
                onChange={handleChange}
                name="description"
                value={formState.values.description}
                variant="outlined"
              />
            </div>
            <div className={classes.formGroup}>
              <Autocomplete
                size="small"
                loading={serviceTypesIsLoading}
                loadingText="Aguarde um momento..."
                noOptionsText="Nada foi encontrado"
                options={serviceTypes}
                value={formState.values.type} 
                onChange={handleServiceTypeChange}
                onOpen={() => queryServiceType('')}
                style={{ width: 300 }}
                getOptionLabel={option => option.description ? option.description : ''}
                includeInputInList
                renderInput={params => (
                  <TextField
                    {...params}
                    name="type"
                    error={hasError('type')}
                    helperText={hasError('type') ? formState.errors.type[0] : null}
                    label="Tipo"
                    variant="outlined"
                    fullWidth
                    onChange={({target}) => queryServiceType(target.value)}
                  />
                )}
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

ServiceForm.propTypes = {
  service: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default ServiceForm;