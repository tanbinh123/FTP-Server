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
  const { className, page, size, order, orderBy, onRequestSort, onRequestPagination, isLoading, stores, numberOfElements, totalPages, fetchStores, ...rest } = props;

  const classes = useStyles();

  const [selectedStores, setSelectedResults] = useState([]);

  const handleSelectAll = event => {
    const selectedStores = event.target.checked
      ? stores.map(customer => customer.id)
      : [];

    setSelectedResults(selectedStores);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedStores.indexOf(id);
    let newSelectedStores = [];

    if (selectedIndex === -1) {
      newSelectedStores = newSelectedStores.concat(selectedStores, id);
    } else if (selectedIndex === 0) {
      newSelectedStores = newSelectedStores.concat(
        selectedStores.slice(1)
      );
    } else if (selectedIndex === selectedStores.length - 1) {
      newSelectedStores = newSelectedStores.concat(
        selectedStores.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedStores = newSelectedStores.concat(
        selectedStores.slice(0, selectedIndex),
        selectedStores.slice(selectedIndex + 1)
      );
    }

    setSelectedResults(newSelectedStores);
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
        <TableToolbar title="Todos as contas de usuário" numSelected={selectedStores.length} />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedStores.length === stores.length}
                        color="primary"
                        indeterminate={
                          selectedStores.length > 0 &&
                          selectedStores.length < stores.length
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
                        active={orderBy === 'street'}
                        direction={orderBy === 'street' ? order : 'asc'}
                        onClick={createSortHandler('street')}
                        IconComponent={SortIcon}>
                        Endereço
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
                      <TableCell>
                        <Skeleton variant="text" />
                      </TableCell>
                    </TableRow>
                  ))}
                  {stores.map(store => (
                    <TableRow
                      hover
                      key={store.id}
                      selected={selectedStores.indexOf(store.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedStores.indexOf(store.id) !== -1
                          }
                          color="primary"
                          onChange={event =>
                            handleSelectOne(event, store.id)
                          }
                          value={selectedStores.indexOf(store.id) !== -1}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameCell}>
                          <Avatar
                            className={classes.avatar}
                            src={store.thumbnail ? store.thumbnail.uri : ''}
                          >
                            {getInitials(store.fullName)}
                          </Avatar>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to={`/store/${store.id}`}
                              variant="h6"
                            >
                              {store.fullName}
                            </Link>
                            <div>{store.shortName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{store.phoneNumber}</TableCell>
                      <TableCell>{store.street}</TableCell>
                      <TableCell>{store.active === true ? "Sim" : "Não"}</TableCell>
                      <TableCell>
                        <div>
                          <div>{store.createdBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{store.createdDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{store.lastModifiedBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{store.lastModifiedDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          color="primary"
                          component={RouterLink}
                          size="small"
                          to={`/store/${store.id}`}
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
  stores: PropTypes.array.isRequired,
  numberOfElements: PropTypes.number,
  totalPages: PropTypes.number,
  fetchStores: PropTypes.func,
  isLoading: PropTypes.bool
};

Results.defaultProps = {
  stores: [],
  numberOfElements: 0,
  totalPages: 0,
  isLoading: false
};

export default Results;
