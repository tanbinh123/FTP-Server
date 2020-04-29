import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, Avatar, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'utils/axios';
import getInitials from 'utils/getInitials';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {},
  review: {
    marginTop: theme.spacing(2)
  }
}));

const Usage = props => {
  const { className, coupon, ...rest } = props;

  const classes = useStyles();
  const [usages, setUsages] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchUsages = () => {
      if (mounted) {
        axios
          .get('/marketplace-coupon-service/v1/coupon-user?coupon=' + coupon.id)
          .then(response => setUsages(response.data.content));
      }
    };

    fetchUsages();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <List>
        {usages.map(item => (
          <ListItem>
            <ListItemText primary="Código"
              secondary={item.code}
            />
            <ListItemText primary="Loja"
              secondary={item.store != null ? item.store.fullName : 'Aguardando utilização'}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

Usage.propTypes = {
  coupon: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default Usage;