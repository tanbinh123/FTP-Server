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
  const { className, page, size, order, orderBy, onRequestSort, onRequestPagination, isLoading, servers, numberOfElements, totalPages, fetchServers, ...rest } = props;

  const classes = useStyles();

  const [selectedServers, setSelectedResults] = useState([]);

  const handleSelectAll = event => {
    const selectedServers = event.target.checked
      ? servers.map(customer => customer.id)
      : [];

    setSelectedResults(selectedServers);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedServers.indexOf(id);
    let newSelectedServers = [];

    if (selectedIndex === -1) {
      newSelectedServers = newSelectedServers.concat(selectedServers, id);
    } else if (selectedIndex === 0) {
      newSelectedServers = newSelectedServers.concat(
        selectedServers.slice(1)
      );
    } else if (selectedIndex === selectedServers.length - 1) {
      newSelectedServers = newSelectedServers.concat(
        selectedServers.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedServers = newSelectedServers.concat(
        selectedServers.slice(0, selectedIndex),
        selectedServers.slice(selectedIndex + 1)
      );
    }

    setSelectedResults(newSelectedServers);
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
        <TableToolbar title="All servers" numSelected={selectedServers.length} />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedServers.length === servers.length}
                        color="primary"
                        indeterminate={
                          selectedServers.length > 0 &&
                          selectedServers.length < servers.length
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
                  {servers.map(server => (
                    <TableRow
                      hover
                      key={server.id}
                      selected={selectedServers.indexOf(server.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedServers.indexOf(server.id) !== -1
                          }
                          color="primary"
                          onChange={event =>
                            handleSelectOne(event, server.id)
                          }
                          value={selectedServers.indexOf(server.id) !== -1}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameCell}>
                          <Avatar
                            className={classes.avatar}
                            src={server.avatar ? server.avatar.uri : ''}
                          >
                            {getInitials(server.serverName + ' ' + server.lastName)}
                          </Avatar>
                          <div>
                            {server.serverName}
                            <div>{server.lastName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                      <div>
                          <div>{server.serverType.displayName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{server.createdBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{server.createdDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{server.lastModifiedBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{server.lastModifiedDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell>
                        <IconButton component={RouterLink} to={`server/${server.id}`}
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
  servers: PropTypes.array.isRequired,
  numberOfElements: PropTypes.number,
  totalPages: PropTypes.number,
  fetchServers: PropTypes.func,
  isLoading: PropTypes.bool
};

Results.defaultProps = {
  servers: [],
  numberOfElements: 0,
  totalPages: 0,
  isLoading: false
};

export default Results;
