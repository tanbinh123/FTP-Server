import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Drawer
} from '@material-ui/core';
import ArrowForward from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  drawer: {
    width: 420,
    maxWidth: '100%'
  },
  header: {
    padding: theme.spacing(2, 1),
    display: 'flex',
    justifyContent: 'space-between'
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  content: {
    padding: theme.spacing(0, 3),
    flexGrow: 1
  },
  contentSection: {
    padding: theme.spacing(2, 0)
  },
  contentSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },
  contentSectionContent: {},
  formGroup: {
    padding: theme.spacing(2, 0)
  },
  fieldGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  field: {
    marginTop: 0,
    marginBottom: 0
  },
  flexGrow: {
    flexGrow: 1
  },
  addButton: {
    marginLeft: theme.spacing(1)
  },
  tags: {
    marginTop: theme.spacing(1)
  },
  minAmount: {
    marginRight: theme.spacing(3)
  },
  maxAmount: {
    marginLeft: theme.spacing(3)
  },
  radioGroup: {},
  actions: {
    padding: theme.spacing(3),
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  }
}));

const Filter = props => {
  const { open, onClose, onFilter, className, ...rest } = props;

  const classes = useStyles();

  const initialValues = {
    paymentStatus: '',
    tag: '',
    tags: ['Full-Time'],
    amount: [1, 7],
    projectStatus: 'ended',
    customerName: '',
    customerType: 'freelancer',
    customerEmail: '',
    customerPhone: '',
    customerAge: ''
  };

  const [values, setValues] = useState({ ...initialValues });

  const handleClear = () => {
    setValues({ ...initialValues }, onClose());
  };

  const handleSubmit = event => {
    event.preventDefault();
    onClose();
    onFilter && onFilter(values);
  };


  return (
    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant="temporary"
    >
      <form
        {...rest}
        className={clsx(classes.root, className)}
        onSubmit={handleSubmit}
      >
        <div className={classes.header}>
          <Button
            onClick={onClose}
            size="small"
          >
            <ArrowForward className={classes.buttonIcon} />
            Fechar
          </Button>
          <Button
            onClick={handleClear}
            size="small"
            color="primary"
          >
            Limpar tudo
          </Button>
        </div>
        <div className={classes.content}>
          <div className={classes.contentSection}>
          </div>
        </div>
        <div className={classes.actions}>
          <Button
            color="primary"
            fullWidth
            type="submit"
            variant="contained"
            onClick={handleSubmit}
          >
            Aplicar filtros
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

Filter.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  onFilter: PropTypes.func,
  open: PropTypes.bool.isRequired
};

export default Filter;
