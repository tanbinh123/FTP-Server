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
  LinearProgress
} from '@material-ui/core';

import getInitials from 'utils/getInitials';
import { ReviewStars, TableToolbar } from 'components';
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
  }
}));

const Results = props => {
  const { className, page, size, order, orderBy, onRequestSort, onRequestPagination, isLoading, schedules, numberOfElements, totalPages, fetchSchedules, ...rest } = props;

  const classes = useStyles();

  const [selectedSchedules, setSelectedResults] = useState([]);

  const handleSelectAll = event => {
    const selectedSchedules = event.target.checked
      ? schedules.map(customer => customer.id)
      : [];

    setSelectedResults(selectedSchedules);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedSchedules.indexOf(id);
    let newSelectedSchedules = [];

    if (selectedIndex === -1) {
      newSelectedSchedules = newSelectedSchedules.concat(selectedSchedules, id);
    } else if (selectedIndex === 0) {
      newSelectedSchedules = newSelectedSchedules.concat(
        selectedSchedules.slice(1)
      );
    } else if (selectedIndex === selectedSchedules.length - 1) {
      newSelectedSchedules = newSelectedSchedules.concat(
        selectedSchedules.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedSchedules = newSelectedSchedules.concat(
        selectedSchedules.slice(0, selectedIndex),
        selectedSchedules.slice(selectedIndex + 1)
      );
    }

    setSelectedResults(newSelectedSchedules);
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
        <TableToolbar title="Todos os agendamentos" numSelected={selectedSchedules.length} />
        <Divider />
        <CardContent className={classes.content}>
          { isLoading && <LinearProgress /> }
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedSchedules.length === schedules.length}
                        color="primary"
                        indeterminate={
                          selectedSchedules.length > 0 &&
                          selectedSchedules.length < schedules.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Usuário</TableCell>
                    <TableCell>Serviço</TableCell>
                    <TableCell>Cooperador</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Avaliação</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.map(schedule => (
                    <TableRow
                    hover
                    key={schedule.id}
                    selected={selectedSchedules.indexOf(schedule.id) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={
                          selectedSchedules.indexOf(schedule.id) !== -1
                        }
                        color="primary"
                        onChange={event =>
                          handleSelectOne(event, schedule.id)
                        }
                        value={selectedSchedules.indexOf(schedule.id) !== -1}
                      />
                    </TableCell>
                    <TableCell>
                      <div className={classes.nameCell}>
                        <Avatar
                          className={classes.avatar}
                        >
                          {getInitials(schedule.account.fullName)}
                        </Avatar>
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/account/${schedule.account.id}`}
                            variant="h6"
                          >
                            {schedule.account.fullName}
                          </Link>
                          <div>{schedule.account.shortName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                    { schedule.calendarTime.calendar.service && (<>
                      <div className={classes.nameCell}>
                        <Avatar
                          className={classes.avatar}
                        >
                          {getInitials(schedule.calendarTime.calendar.service.description)}
                        </Avatar>
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/service/${schedule.calendarTime.calendar.service.id}`}
                            variant="h6"
                          >
                            {schedule.calendarTime.calendar.service.description}
                          </Link>
                          <div>{schedule.calendarTime.calendar.service.type != null ? schedule.calendarTime.calendar.service.type.description : ''}</div>
                        </div>
                      </div>
                      </>)}
                    </TableCell>
                    <TableCell>
                      { schedule.calendarTime.calendar.cooperator && (<>
                      <div className={classes.nameCell}>
                        <Avatar
                          className={classes.avatar}
                          src={schedule.calendarTime.calendar.cooperator.thumbnail}
                        >
                          {getInitials(schedule.calendarTime.calendar.cooperator.fullName)}
                        </Avatar>
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/cooperator/${schedule.calendarTime.calendar.cooperator.id}`}
                            variant="h6"
                          >
                            {schedule.calendarTime.calendar.cooperator.fullName}
                          </Link>
                          <div>{schedule.calendarTime.calendar.cooperator.register}</div>
                        </div>
                      </div>
                      </>)}
                    </TableCell>
                    <TableCell>{schedule.status}</TableCell>
                    <TableCell>{currencyFormat(schedule.price)}</TableCell>
                    <TableCell><Moment format="DD/MM/YYYY HH:mm" local>{schedule.calendarTime.date}</Moment></TableCell>
                    <TableCell>
                      <ReviewStars value={schedule.rating} />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        color="primary"
                        component={RouterLink}
                        size="small"
                        to={`/calendar/${schedule.id}`}
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
  schedules: PropTypes.array.isRequired,
  numberOfElements: PropTypes.number,
  totalPages: PropTypes.number,
  fetchSchedules: PropTypes.func,
  isLoading: PropTypes.bool
};

Results.defaultProps = {
  schedules: [],
  numberOfElements: 0,
  totalPages: 0,
  isLoading: false
};

export default Results;
