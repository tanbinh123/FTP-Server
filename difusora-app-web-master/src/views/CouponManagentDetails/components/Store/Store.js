import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, Avatar, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'utils/axios';
import getInitials from 'utils/getInitials';
const useStyles = makeStyles(theme => ({
  root: {},
  review: {
    marginTop: theme.spacing(2)
  }
}));

const Store = props => {
  const { className, coupon, ...rest } = props;

  const classes = useStyles();
  const [stores, setStores] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchStores = () => {
      if (mounted) {
        axios
          .get('/v1/coupon-store?coupon=' + coupon.id)
          .then(response => setStores(response.data.content));
      }
    };

    fetchStores();

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
        {stores.map(item => (
          <ListItem>
            <ListItemAvatar>
              <Avatar src={item.store.thumbnail ? item.store.thumbnail.uri : ''}>
                {getInitials(item.store.fullName)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={item.store.fullName}
              secondary={item.expirationAt}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

Store.propTypes = {
  coupon: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default Store;