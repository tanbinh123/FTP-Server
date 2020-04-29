import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
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
import { currencyFormat } from 'utils/currency';

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
  const { className, page, size, order, orderBy, onRequestSort, onRequestPagination, isLoading, calendars, numberOfElements, totalPages, fetchCalendars, ...rest } = props;

  const classes = useStyles();

  const [selectedCalendars, setSelectedResults] = useState([]);

  const handleSelectAll = event => {
    const selectedCalendars = event.target.checked
      ? calendars.map(customer => customer.id)
      : [];

    setSelectedResults(selectedCalendars);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCalendars.indexOf(id);
    let newSelectedCalendars = [];

    if (selectedIndex === -1) {
      newSelectedCalendars = newSelectedCalendars.concat(selectedCalendars, id);
    } else if (selectedIndex === 0) {
      newSelectedCalendars = newSelectedCalendars.concat(
        selectedCalendars.slice(1)
      );
    } else if (selectedIndex === selectedCalendars.length - 1) {
      newSelectedCalendars = newSelectedCalendars.concat(
        selectedCalendars.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedCalendars = newSelectedCalendars.concat(
        selectedCalendars.slice(0, selectedIndex),
        selectedCalendars.slice(selectedIndex + 1)
      );
    }

    setSelectedResults(newSelectedCalendars);
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
        <TableToolbar title="Todos as agendas" numSelected={selectedCalendars.length} />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCalendars.length === calendars.length}
                        color="primary"
                        indeterminate={
                          selectedCalendars.length > 0 &&
                          selectedCalendars.length < calendars.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'place'}
                        direction={orderBy === 'place' ? order : 'asc'}
                        onClick={createSortHandler('place')}
                        IconComponent={SortIcon}>
                        Local
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'service'}
                        direction={orderBy === 'service' ? order : 'asc'}
                        onClick={createSortHandler('service')}
                        IconComponent={SortIcon}>
                        Serviço
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'cooperator'}
                        direction={orderBy === 'cooperator' ? order : 'asc'}
                        onClick={createSortHandler('cooperator')}
                        IconComponent={SortIcon}>
                        Cooperador
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'price'}
                        direction={orderBy === 'price' ? order : 'asc'}
                        onClick={createSortHandler('price')}
                        IconComponent={SortIcon}>
                        Valor
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'date'}
                        direction={orderBy === 'date' ? order : 'asc'}
                        onClick={createSortHandler('date')}
                        IconComponent={SortIcon}>
                        Data
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                     <TableSortLabel
                        active={orderBy === 'active'}
                        direction={orderBy === 'active' ? order : 'asc'}
                        onClick={createSortHandler('active')}
                        IconComponent={SortIcon}>
                        Ativo
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
                    </TableRow>
                  ))}
                  {calendars.map(calendar => (
                    <TableRow
                      hover
                      key={calendar.id}
                      selected={selectedCalendars.indexOf(calendar.id) !== -1}
                      className={calendar.active ? classes.active : null}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedCalendars.indexOf(calendar.id) !== -1
                          }
                          color="primary"
                          onChange={event =>
                            handleSelectOne(event, calendar.id)
                          }
                          value={selectedCalendars.indexOf(calendar.id) !== -1}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameCell}>
                          <Avatar
                            className={classes.avatar}
                            src={calendar.place.thumbnail}
                          >
                            {getInitials(calendar.place.fullName)}
                          </Avatar>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to={`/place/${calendar.place.id}`}
                              variant="h6"
                            >
                              {calendar.place.fullName}
                            </Link>
                            <div>{calendar.place.district}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                      { calendar.service && (<>
                        <div className={classes.nameCell}>
                          <Avatar
                            className={classes.avatar}
                            src={calendar.service.thumbnail}
                          >
                            {getInitials(calendar.service.description)}
                          </Avatar>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to={`/service/${calendar.service.id}`}
                              variant="h6"
                            >
                              {calendar.service.description}
                            </Link>
                            <div>{calendar.service.type != null ? calendar.service.type.description : ''}</div>
                          </div>
                        </div>
                        </>)}
                      </TableCell>
                      <TableCell>
                        { calendar.cooperator && (<>
                        <div className={classes.nameCell}>
                          <Avatar
                            className={classes.avatar}
                            src={calendar.cooperator.thumbnail}
                          >
                            {getInitials(calendar.cooperator.fullName)}
                          </Avatar>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to={`/cooperator/${calendar.cooperator.id}`}
                              variant="h6"
                            >
                              {calendar.cooperator.fullName}
                            </Link>
                            <div>{calendar.cooperator.register}</div>
                          </div>
                        </div>
                        </>)}
                      </TableCell>
                      <TableCell>{currencyFormat(calendar.price)}</TableCell>
                      <TableCell><Moment format="DD/MM/YYYY" local>{calendar.date}</Moment></TableCell>
                      <TableCell>{calendar.service.active === true ? "Sim" : "Não"}</TableCell>
                      <TableCell align="right">
                        <Button
                          color="primary"
                          component={RouterLink}
                          size="small"
                          to={`/calendar/${calendar.id}`}
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
  calendars: PropTypes.array.isRequired,
  numberOfElements: PropTypes.number,
  totalPages: PropTypes.number,
  fetchCalendars: PropTypes.func,
  isLoading: PropTypes.bool
};

Results.defaultProps = {
  calendars: [],
  numberOfElements: 0,
  totalPages: 0,
  isLoading: false
};

export default Results;
