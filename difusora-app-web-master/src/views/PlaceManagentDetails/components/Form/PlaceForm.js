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
  Switch,
  colors
} from '@material-ui/core';

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
  street: {
    presence: { allowEmpty: false, message: '^Endereço é obrigatório' }
  },
  district: {
    presence: { allowEmpty: false, message: '^Bairro é obrigatório' }
  },
  zipCode: {
    presence: { allowEmpty: false, message: '^Código postal é obrigatório' }
  }
};

const PlaceForm = props => {
  const { place, onSubmit, className, ...rest } = props;

  const [formState, setFormState] = useState({
    isValid: false,
    values: { ...place },
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
        <CardHeader title="Dados do lugar" action={<Switch
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
            <div className={classes.fieldGroup}>
              <TextField
                size="small"
                className={classes.textField}
                error={hasError('phoneNumber')}
                helperText={hasError('phoneNumber') ? formState.errors.phoneNumber[0] : null}
                label="Telefone"
                onChange={handleChange}
                name="phoneNumber"
                value={formState.values.phoneNumber}
                variant="outlined"
              />
              <TextField
                size="small"
                className={classes.textField}
                error={hasError('mobileNumber')}
                helperText={hasError('mobileNumber') ? formState.errors.mobileNumber[0] : null}
                label="Celular"
                onChange={handleChange}
                name="mobileNumber"
                value={formState.values.mobileNumber}
                variant="outlined"
              />
              </div>
          </div>
          <Divider />
          <div className={classes.formGroup}>
            <div className={classes.fieldGroup}>
              <TextField
                size="small"
                className={classes.textField}
                error={hasError('zipCode')}
                helperText={hasError('zipCode') ? formState.errors.zipCode[0] : null}
                label="Código Postal"
                name="zipCode"
                onChange={handleChange}
                value={formState.values.zipCode}
                variant="outlined"
              />
            </div>
          </div>
          <div className={classes.formGroup}>
            <div className={classes.fieldGroup}>
              <TextField
                size="small"
                className={classes.textField}
                fullWidth
                error={hasError('street')}
                helperText={hasError('street') ? formState.errors.street[0] : null}
                label="Endereço"
                name="street"
                onChange={handleChange}
                value={formState.values.street}
                variant="outlined"
              />
              <TextField
                size="small"
                className={classes.textField}
                error={hasError('number')}
                helperText={hasError('number') ? formState.errors.number[0] : null}
                label="Numero"
                name="number"
                onChange={handleChange}
                value={formState.values.number}
                variant="outlined"
              />
            </div>
          </div>
          <div className={classes.formGroup}>
            <TextField
              size="small"
              className={classes.textField}
              fullWidth
              error={hasError('district')}
              helperText={hasError('district') ? formState.errors.district[0] : null}
              label="Bairro"
              name="district"
              onChange={handleChange}
              value={formState.values.district}
              variant="outlined"
            />
          </div>
          <div className={classes.formGroup}>
            <TextField
              size="small"
              className={classes.textField}
              fullWidth
              error={hasError('reference')}
              helperText={hasError('reference') ? formState.errors.reference[0] : null}
              label="Referência"
              name="reference"
              onChange={handleChange}
              value={formState.values.reference}
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

PlaceForm.propTypes = {
  place: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default PlaceForm;