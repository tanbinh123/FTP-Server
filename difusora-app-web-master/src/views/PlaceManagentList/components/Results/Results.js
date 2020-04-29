import React, { useState } from 'react';
import axios from 'utils/axios';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from '@material-ui/core';
import SortIcon from '@material-ui/icons/Sort';
import Skeleton from '@material-ui/lab/Skeleton';
import palette from 'theme/palette';
import getInitials from 'utils/getInitials';
import { TableToolbar } from 'components';
import Moment from 'react-moment';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 700
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  },
  active: {
    borderLeftWidth: 2, 
    borderLeftStyle: 'solid', 
    borderLeftColor: palette.green
  }
}));

const Results = props => {
  const { className, page, size, order, orderBy, onRequestSort, onRequestPagination, isLoading, places, numberOfElements, totalPages, fetchPlaces, ...rest } = props;

  const classes = useStyles();

  const [selectedPlaces, setSelectedResults] = useState([]);

  const handleSelectAll = event => {
    const selectedPlaces = event.target.checked
      ? places.map(customer => customer.id)
      : [];

    setSelectedResults(selectedPlaces);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedPlaces.indexOf(id);
    let newSelectedPlaces = [];

    if (selectedIndex === -1) {
      newSelectedPlaces = newSelectedPlaces.concat(selectedPlaces, id);
    } else if (selectedIndex === 0) {
      newSelectedPlaces = newSelectedPlaces.concat(
        selectedPlaces.slice(1)
      );
    } else if (selectedIndex === selectedPlaces.length - 1) {
      newSelectedPlaces = newSelectedPlaces.concat(
        selectedPlaces.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedPlaces = newSelectedPlaces.concat(
        selectedPlaces.slice(0, selectedIndex),
        selectedPlaces.slice(selectedIndex + 1)
      );
    }

    setSelectedResults(newSelectedPlaces);
  };

  const handleChangePage = (event, number) => {
    onRequestPagination(event, number + 1, size);
  };

  const handleChangeRowsPerPage = event => {
    onRequestPagination(event, page, event.target.value);
  };

  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Card>
        <TableToolbar title="Todos os lugares" numSelected={selectedPlaces.length} />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedPlaces.length === places.length}
                        color="primary"
                        indeterminate={
                          selectedPlaces.length > 0 &&
                          selectedPlaces.length < places.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'serverName'}
                        direction={orderBy === 'serverName' ? order : 'asc'}
                        onClick={createSortHandler('serverName')}
                        IconComponent={SortIcon}>
                        Nome
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'street'}
                        direction={orderBy === 'street' ? order : 'asc'}
                        onClick={createSortHandler('street')}
                        IconComponent={SortIcon}>
                        Endereço
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'zipCode'}
                        direction={orderBy === 'zipCode' ? order : 'asc'}
                        onClick={createSortHandler('zipCode')}
                        IconComponent={SortIcon}>
                        Código postal
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'phoneNumber'}
                        direction={orderBy === 'phoneNumber' ? order : 'asc'}
                        onClick={createSortHandler('phoneNumber')}
                        IconComponent={SortIcon}>
                        Telefone
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'mobileNumber'}
                        direction={orderBy === 'mobileNumber' ? order : 'asc'}
                        onClick={createSortHandler('mobileNumber')}
                        IconComponent={SortIcon}>
                        Celular
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'createdDate'}
                        direction={orderBy === 'createdDate' ? order : 'asc'}
                        onClick={createSortHandler('createdDate')}
                        IconComponent={SortIcon}>
                        Criação
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'lastModifiedDate'}
                        direction={orderBy === 'lastModifiedDate' ? order : 'asc'}
                        onClick={createSortHandler('lastModifiedDate')}
                        IconComponent={SortIcon}>
                        Alteração
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                { isLoading && Array(size).fill(size).map((key, index) => (
                    <TableRow key={index}>
                      <TableCell padding="checkbox"/>
                      <TableCell>
                        <div className={classes.nameCell}>
                          <Skeleton variant="circle" className={classes.avatar} />
                          <div>
                            <Skeleton variant="text" width={150} />
                            <div>
                              <Skeleton variant="text" />
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" />
                      </TableCell>
                      <TableCell>
                        <div>
                          <Skeleton variant="text" />
                        </div>
                        <Skeleton variant="text" />
                      </TableCell>
                      <TableCell>
                        <div>
                          <Skeleton variant="text" />
                        </div>
                        <Skeleton variant="text" />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" />
                      </TableCell>
                    </TableRow>
                  ))}
                  { !isLoading && places.map(place => (
                    <TableRow
                      hover
                      key={place.id}
                      selected={selectedPlaces.indexOf(place.id) !== -1}
                      className={place.active ? classes.active : null}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedPlaces.indexOf(place.id) !== -1
                          }
                          color="primary"
                          onChange={event =>
                            handleSelectOne(event, place.id)
                          }
                          value={selectedPlaces.indexOf(place.id) !== -1}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameCell}>
                          <Avatar
                            className={classes.avatar}
                            src={place.thumbnail}
                          >
                            {getInitials(place.serverName)}
                          </Avatar>
                          <div>
                          <Link
                              color="inherit"
                              component={RouterLink}
                              to={`/place/${place.id}`}
                              variant="h6"
                            >
                              {place.serverName}
                            </Link>
                            <div>{place.district}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{place.street}</TableCell>
                      <TableCell>{place.zipCode}</TableCell>
                      <TableCell>{place.phoneNumber}</TableCell>
                      <TableCell>{place.mobileNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div>{place.createdBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{place.createdDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{place.lastModifiedBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{place.lastModifiedDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          color="primary"
                          component={RouterLink}
                          size="small"
                          to={`/place/${place.id}`}
                        >
                          Detalhar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <CardActions className={classes.actions}>
          <TablePagination
            component="div"
            labelDisplayedRows={({from, to, count, page}) => `${from}-${to} de ${count}`}
            labelRowsPerPage="Linhas por página:"
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={size}
            rowsPerPageOptions={[5, 10, 20, 50]}
            count={numberOfElements}
          />
        </CardActions>
      </Card>
    </div>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  places: PropTypes.array.isRequired,
  numberOfElements: PropTypes.number,
  totalPages: PropTypes.number,
  fetchPlaces: PropTypes.func,
  isLoading: PropTypes.bool,
  onRequestSort: PropTypes.func.isRequired,
  onRequestPagination: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};

Results.defaultProps = {
  places: [],
  numberOfElements: 0,
  totalPages: 0,
  isLoading: false
};

export default Results;
