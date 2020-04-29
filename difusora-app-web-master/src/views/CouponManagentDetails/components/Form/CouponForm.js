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
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
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
    height: 100,
    width: 100,
    marginRight: theme.spacing(1)
  }
}));

const schema = {
  description: {
    presence: { allowEmpty: false, message: '^Descrição é obrigatória' }
  },
  expirationAt: {
    presence: { allowEmpty: false, message: '^Data da expiração é obrigatória' }
  }
};

const CouponForm = props => {
  const { coupon, onSubmit, className, ...rest } = props;

  const [formState, setFormState] = useState({
    isValid: false,
    values: { ...coupon },
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

  const handleExpirationAtChange = async (newValue) => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        expirationAt: newValue
      },
      touched: {
        ...formState.touched,
        expirationAt: true
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

  const onDrop = useCallback(files => {
    const data = new FormData();
    data.append('file', files[0]);
    axios({
      method: 'POST',
      url: '/marketplace-coupon-service/v1/storage',
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
        <CardHeader title="Dados do cupom" action={<Switch
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
                variant="square"
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
            <KeyboardDatePicker
              disableToolbar
              className={classes.textField}
              variant="outlined"
              format="DD/MM/YYYY"
              margin="normal"
              label="Expira em "
              value={formState.values.expirationAt}
              onChange={handleExpirationAtChange}
            />
          </div>
          <div className={classes.formGroup}>
            <TextField
              type="number"
              size="small"
              className={classes.textField}
              error={hasError('quantity')}
              helperText={hasError('quantity') ? formState.errors.quantity[0] : null}
              label="Quantidade"
              onChange={handleChange}
              name="quantity"
              value={formState.values.quantity}
              variant="outlined"
            />
          </div>
          <div className={classes.formGroup}>
            <TextField
              type="number"
              size="small"
              className={classes.textField}
              error={hasError('limit')}
              helperText={hasError('limit') ? formState.errors.limit[0] : null}
              label="Limite de uso"
              onChange={handleChange}
              name="limit"
              value={formState.values.limit}
              variant="outlined"
            />
          </div>
          <div className={classes.formGroup}>
            <TextField
              type="number"
              size="small"
              className={classes.textField}
              error={hasError('discount')}
              helperText={hasError('discount') ? formState.errors.discount[0] : null}
              label="Desconto %"
              onChange={handleChange}
              name="discount"
              value={formState.values.discount}
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

CouponForm.propTypes = {
  coupon: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default CouponForm;