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
  Divider,
  colors,
  Chip,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Switch,
  ListItemIcon
} from '@material-ui/core';
import { CurrencyTextField } from 'components';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { debounce } from "throttle-debounce";
import axios from 'utils/axios';
import DeleteIcon from '@material-ui/icons/Delete';
import AccessTimeOutlinedIcon from '@material-ui/icons/AccessTimeOutlined';
import AddIcon from '@material-ui/icons/Add';
import Moment from 'react-moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

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
  place: {
    presence: { allowEmpty: false, message: '^Lugar é obrigatório' }
  },
  cooperator: {
    presence: { allowEmpty: false, message: '^Colaborador é obrigatório' }
  },
  service: {
    presence: { allowEmpty: false, message: '^Serviço é obrigatório' }
  },
  date: {
    presence: { allowEmpty: false, message: '^Data é obrigatório' }
  },
  price: {
    presence: { allowEmpty: false, message: '^Valor é obrigatório' }
  }
};

const CalendarForm = props => {
  const { calendar, onSubmit, className, ...rest } = props;

  const [formState, setFormState] = useState({
    isValid: false,
    values: { ...calendar },
    touched: {},
    errors: {}
  });

  const [places, setPlaces] = React.useState([]);
  const [placesIsLoading, setPlacesIsLoading] = React.useState(false);

  const [cooperators, setCooperators] = React.useState([]);
  const [cooperatorsIsLoading, setCooperatorsIsLoading] = React.useState(false);

  const [services, setServices] = React.useState([]);
  const [servicesIsLoading, setServicesIsLoading] = React.useState(false);

  const [time, setTime] = React.useState(new Date());

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

  const handlePlaceChange = async (event, newValue) => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        place: newValue
      },
      touched: {
        ...formState.touched,
        place: true
      }
    }));
  };
  
  const handleCooperatorChange = async (event, newValue) => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        cooperator: newValue
      },
      touched: {
        ...formState.touched,
        cooperator: true
      }
    }));
  };

  const handleServiceChange = async (event, newValue) => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        service: newValue
      },
      touched: {
        ...formState.touched,
        service: true
      }
    }));
  };

  const handlePriceChange = async (event, newValue) => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        price: newValue
      },
      touched: {
        ...formState.touched,
        price: true
      }
    }));
  };

  const handleTimeChange = date => {
    setTime(date);
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

  const searchCooperators = debounce(500, (value) => {
    axios.get(`/v1/cooperator?fullName=${value}&size=10`).then(response => {
      setCooperators(response.data.content);
      setCooperatorsIsLoading(false);
    }).catch((error) => {
      setCooperators([]);
    }).finally(() => {
      setCooperatorsIsLoading(false);
    });
  });
  
  const queryCooperators = value => {
    setCooperatorsIsLoading(true);
    searchCooperators(value);
  };

  const searchPlaces = debounce(500, (value) => {
    axios.get(`/v1/place?fullName=${value}&size=10`).then(response => {
      setPlaces(response.data.content);
      setPlacesIsLoading(false);
    }).catch((error) => {
      setPlaces([]);
    }).finally(() => {
      setPlacesIsLoading(false);
    });
  });
  
  const queryPlaces = value => {
    setPlacesIsLoading(true);
    searchPlaces(value);
  };

  return (
    <form
        {...rest}
        className={clsx(classes.root, className)}
        onSubmit={handleSubmit}
      >
      <Card
        {...rest}
        className={clsx(classes.root, className)}>
          <CardHeader title="Dados da agenda" action={<Switch
            checked={formState.values.active}
            onChange={handleChange}
            name="active"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />} />
        <CardContent>
          <div className={classes.formGroup}>
            <Autocomplete
              size="small"
              loading={placesIsLoading}
              loadingText="Aguarde um momento..."
              noOptionsText="Nada foi encontrado"
              options={places}
              value={formState.values.place} 
              onChange={handlePlaceChange}
              onOpen={() => queryPlaces('')}
              style={{ width: 500 }}
              getOptionLabel={option => option.fullName ? option.fullName : ''}
              includeInputInList
              renderInput={params => (
                <TextField
                  {...params}
                  name="place"
                  error={hasError('place')}
                  helperText={hasError('place') ? formState.errors.place[0] : null}
                  label="Lugar"
                  variant="outlined"
                  fullWidth
                  onChange={({target}) => queryPlaces(target.value)}
                />
              )}
            />
          </div>
          <div className={classes.formGroup}>
            <Autocomplete
              size="small"
              loading={cooperatorsIsLoading}
              loadingText="Aguarde um momento..."
              noOptionsText="Nada foi encontrado"
              options={cooperators}
              value={formState.values.cooperator} 
              onChange={handleCooperatorChange}
              onOpen={() => queryCooperators('')}
              style={{ width: 500 }}
              getOptionLabel={option => option.fullName ? option.register + ' - ' + option.fullName : ''}
              includeInputInList
              renderInput={params => (
                <TextField
                  {...params}
                  name="cooperator"
                  error={hasError('cooperator')}
                  helperText={hasError('cooperator') ? formState.errors.cooperator[0] : null}
                  label="Colaborador"
                  variant="outlined"
                  fullWidth
                  onChange={({target}) => queryCooperators(target.value)}
                />
              )}
            />
          </div>
          <div className={classes.formGroup}>
            <Autocomplete
              size="small"
              loading={servicesIsLoading}
              loadingText="Aguarde um momento..."
              noOptionsText="Nada foi encontrado"
              options={services}
              value={formState.values.service} 
              onChange={handleServiceChange}
              onOpen={() => queryServices('')}
              style={{ width: 500 }}
              getOptionLabel={option => option.description ? option.description : ''}
              includeInputInList
              renderInput={params => (
                <TextField
                  {...params}
                  name="service"
                  error={hasError('service')}
                  helperText={hasError('service') ? formState.errors.service[0] : null}
                  label="Serviço"
                  variant="outlined"
                  fullWidth
                  onChange={({target}) => queryServices(target.value)}
                />
              )}
            />
          </div>
          <div className={classes.formGroup}>
            <CurrencyTextField
              size="small"
              className={classes.textField}
              error={hasError('price')}
              helperText={hasError('price') ? formState.errors.price[0] : null}
              label="Valor"
              onChange={handlePriceChange}
              name="price"
              value={formState.values.price}
              variant="outlined"
              currencySymbol="R$"
              decimalCharacter=","
              digitGroupSeparator="."
              minimumValue={0}
            />
          </div>
          <Card style={{width: 500}}>
            <CardHeader title="Horários"/>
            <List>
              { formState.values.times 
                && Object.entries(formState.values.times).map(([key, value]) => (
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="h6" display="block">
                      <Moment format="HH:mm" local>{value}</Moment>
                    </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Card>
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

CalendarForm.propTypes = {
  calendar: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default CalendarForm;