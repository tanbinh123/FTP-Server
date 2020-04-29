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
  const { className, page, size, order, orderBy, onRequestSort, onRequestPagination, isLoading, accounts, numberOfElements, totalPages, fetchAccounts, ...rest } = props;

  const classes = useStyles();

  const [selectedAccounts, setSelectedResults] = useState([]);

  const handleSelectAll = event => {
    const selectedAccounts = event.target.checked
      ? accounts.map(customer => customer.id)
      : [];

    setSelectedResults(selectedAccounts);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedAccounts.indexOf(id);
    let newSelectedAccounts = [];

    if (selectedIndex === -1) {
      newSelectedAccounts = newSelectedAccounts.concat(selectedAccounts, id);
    } else if (selectedIndex === 0) {
      newSelectedAccounts = newSelectedAccounts.concat(
        selectedAccounts.slice(1)
      );
    } else if (selectedIndex === selectedAccounts.length - 1) {
      newSelectedAccounts = newSelectedAccounts.concat(
        selectedAccounts.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedAccounts = newSelectedAccounts.concat(
        selectedAccounts.slice(0, selectedIndex),
        selectedAccounts.slice(selectedIndex + 1)
      );
    }

    setSelectedResults(newSelectedAccounts);
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
        <TableToolbar title="Todos as contas de usuário" numSelected={selectedAccounts.length} />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAccounts.length === accounts.length}
                        color="primary"
                        indeterminate={
                          selectedAccounts.length > 0 &&
                          selectedAccounts.length < accounts.length
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
                        active={orderBy === 'email'}
                        direction={orderBy === 'email' ? order : 'asc'}
                        onClick={createSortHandler('email')}
                        IconComponent={SortIcon}>
                        Correio eletrônico
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'expirationAt'}
                        direction={orderBy === 'expirationAt' ? order : 'asc'}
                        onClick={createSortHandler('expirationAt')}
                        IconComponent={SortIcon}>
                        Expiração
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
                  {accounts.map(account => (
                    <TableRow
                      hover
                      key={account.id}
                      selected={selectedAccounts.indexOf(account.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedAccounts.indexOf(account.id) !== -1
                          }
                          color="primary"
                          onChange={event =>
                            handleSelectOne(event, account.id)
                          }
                          value={selectedAccounts.indexOf(account.id) !== -1}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameCell}>
                          <Avatar
                            className={classes.avatar}
                            src={account.thumbnail ? account.thumbnail.uri : ''}
                          >
                            {getInitials(account.fullName)}
                          </Avatar>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to={`/account/${account.id}`}
                              variant="h6"
                            >
                              {account.fullName}
                            </Link>
                            <div>{account.shortName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{account.phoneNumber}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>{account.expirationDate ? account.expirationDate : "Não informada"}</TableCell>
                      <TableCell>{account.active === true ? "Sim" : "Não"}</TableCell>
                      <TableCell>
                        <div>
                          <div>{account.createdBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{account.createdDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{account.lastModifiedBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{account.lastModifiedDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          color="primary"
                          component={RouterLink}
                          size="small"
                          to={`/account/${account.id}`}
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
  accounts: PropTypes.array.isRequired,
  numberOfElements: PropTypes.number,
  totalPages: PropTypes.number,
  fetchAccounts: PropTypes.func,
  isLoading: PropTypes.bool
};

Results.defaultProps = {
  accounts: [],
  numberOfElements: 0,
  totalPages: 0,
  isLoading: false
};

export default Results;
