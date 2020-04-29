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
  TableSortLabel,
  IconButton
} from '@material-ui/core';
import SortIcon from '@material-ui/icons/Sort';
import Skeleton from '@material-ui/lab/Skeleton';
import EditIcon from '@material-ui/icons/Edit';
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
  const { className, page, size, order, orderBy, onRequestSort, onRequestPagination, isLoading, persons, numberOfElements, totalPages, fetchPersons, ...rest } = props;

  const classes = useStyles();

  const [selectedPersons, setSelectedResults] = useState([]);

  const handleSelectAll = event => {
    const selectedPersons = event.target.checked
      ? persons.map(customer => customer.id)
      : [];

    setSelectedResults(selectedPersons);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedPersons.indexOf(id);
    let newSelectedPersons = [];

    if (selectedIndex === -1) {
      newSelectedPersons = newSelectedPersons.concat(selectedPersons, id);
    } else if (selectedIndex === 0) {
      newSelectedPersons = newSelectedPersons.concat(
        selectedPersons.slice(1)
      );
    } else if (selectedIndex === selectedPersons.length - 1) {
      newSelectedPersons = newSelectedPersons.concat(
        selectedPersons.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedPersons = newSelectedPersons.concat(
        selectedPersons.slice(0, selectedIndex),
        selectedPersons.slice(selectedIndex + 1)
      );
    }

    setSelectedResults(newSelectedPersons);
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
        <TableToolbar title="Todos as contas de usuário" numSelected={selectedPersons.length} />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedPersons.length === persons.length}
                        color="primary"
                        indeterminate={
                          selectedPersons.length > 0 &&
                          selectedPersons.length < persons.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'fullName'}
                        direction={orderBy === 'fullName' ? order : 'asc'}
                        onClick={createSortHandler('fullName')}
                        IconComponent={SortIcon}>
                        Nome
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      Type
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
                    </TableRow>
                  ))}
                  {persons.map(person => (
                    <TableRow
                      hover
                      key={person.id}
                      selected={selectedPersons.indexOf(person.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedPersons.indexOf(person.id) !== -1
                          }
                          color="primary"
                          onChange={event =>
                            handleSelectOne(event, person.id)
                          }
                          value={selectedPersons.indexOf(person.id) !== -1}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameCell}>
                          <Avatar
                            className={classes.avatar}
                            src={person.avatar ? person.avatar.uri : ''}
                          >
                            {getInitials(person.fullName + ' ' + person.lastName)}
                          </Avatar>
                          <div>
                            {person.fullName}
                            <div>{person.lastName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                      <div>
                          <div>{person.personType.displayName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{person.createdBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{person.createdDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{person.lastModifiedBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{person.lastModifiedDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell>
                        <IconButton component={RouterLink} to={`person/${person.id}`}
                        ><EditIcon></EditIcon></IconButton>
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
  persons: PropTypes.array.isRequired,
  numberOfElements: PropTypes.number,
  totalPages: PropTypes.number,
  fetchPersons: PropTypes.func,
  isLoading: PropTypes.bool
};

Results.defaultProps = {
  persons: [],
  numberOfElements: 0,
  totalPages: 0,
  isLoading: false
};

export default Results;
