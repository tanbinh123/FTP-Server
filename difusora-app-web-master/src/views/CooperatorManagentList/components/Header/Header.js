import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Button, IconButton, Divider } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import { Link as RouterLink } from 'react-router-dom';
import Filter from '../Filter';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  content: {
    display: 'flex',
    alignItems: 'center'
  },
  divider: {
    backgroundColor: theme.palette.text.secondary,
    width: 1,
    height: 12,
    margin: 10
  }
}));

const Header = props => {
  const { className, onFilter, onSearch, numberOfElements, ...rest } = props;

  const classes = useStyles();
  const [openFilter, setOpenFilter] = useState(false);

  const handleFilterOpen = () => {
    setOpenFilter(true);
  };

  const handleFilterClose = () => {
    setOpenFilter(false);
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid
        className={clsx(classes.root)}
        container
        spacing={3}>
        <Grid item>
          <Grid
            className={clsx(classes.content)}
            container>
            <Button
              size="small"
              color="secondary"
              variant="contained"
              component={RouterLink}
              to={`/cooperator/new`}>
            Adicionar
            </Button>
            <Divider className={classes.divider}/>
            <Typography
              color="textSecondary"
              variant="body2">
              {numberOfElements} registros encontrados
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <IconButton
            onClick={onSearch}>
            <SearchIcon edge="end"/>
          </IconButton>
          <IconButton
            onClick={handleFilterOpen}>
            <FilterListIcon className={classes.filterIcon} />
          </IconButton>
        </Grid>
      </Grid>
      <Filter
        onClose={handleFilterClose}
        onFilter={onFilter}
        open={openFilter}
      />
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  onFilter: PropTypes.func,
  onSearch: PropTypes.func
};

export default Header;
