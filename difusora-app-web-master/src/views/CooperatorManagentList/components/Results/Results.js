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
import { ReviewStars, TableToolbar } from 'components';
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
  const { className, page, size, order, orderBy, onRequestSort, onRequestPagination, isLoading, cooperators, numberOfElements, totalPages, fetchCooperators, ...rest } = props;

  const classes = useStyles();

  const [selectedCooperators, setSelectedResults] = useState([]);

  const handleSelectAll = event => {
    const selectedCooperators = event.target.checked
      ? cooperators.map(customer => customer.id)
      : [];

    setSelectedResults(selectedCooperators);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCooperators.indexOf(id);
    let newSelectedCooperators = [];

    if (selectedIndex === -1) {
      newSelectedCooperators = newSelectedCooperators.concat(selectedCooperators, id);
    } else if (selectedIndex === 0) {
      newSelectedCooperators = newSelectedCooperators.concat(
        selectedCooperators.slice(1)
      );
    } else if (selectedIndex === selectedCooperators.length - 1) {
      newSelectedCooperators = newSelectedCooperators.concat(
        selectedCooperators.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedCooperators = newSelectedCooperators.concat(
        selectedCooperators.slice(0, selectedIndex),
        selectedCooperators.slice(selectedIndex + 1)
      );
    }

    setSelectedResults(newSelectedCooperators);
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
        <TableToolbar title="Todos os colaboradores" numSelected={selectedCooperators.length} />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCooperators.length === cooperators.length}
                        color="primary"
                        indeterminate={
                          selectedCooperators.length > 0 &&
                          selectedCooperators.length < cooperators.length
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
                        active={orderBy === 'shortName'}
                        direction={orderBy === 'shortName' ? order : 'asc'}
                        onClick={createSortHandler('shortName')}
                        IconComponent={SortIcon}>
                        Nome curto
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      Avaliação
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
                  {cooperators.map(cooperator => (
                    <TableRow
                      hover
                      key={cooperator.id}
                      selected={selectedCooperators.indexOf(cooperator.id) !== -1}
                      className={cooperator.active ? classes.active : null}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedCooperators.indexOf(cooperator.id) !== -1
                          }
                          color="primary"
                          onChange={event =>
                            handleSelectOne(event, cooperator.id)
                          }
                          value={selectedCooperators.indexOf(cooperator.id) !== -1}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameCell}>
                          <Avatar
                            className={classes.avatar}
                            src={cooperator.thumbnail}
                          >
                            {getInitials(cooperator.fullName)}
                          </Avatar>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to={`/cooperator/${cooperator.id}`}
                              variant="h6"
                            >
                              {cooperator.fullName}
                            </Link>
                            <div>{cooperator.register}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{cooperator.shortName}</TableCell>
                      <TableCell>
                        <ReviewStars value={cooperator.rating} />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{cooperator.createdBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{cooperator.createdDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{cooperator.lastModifiedBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{cooperator.lastModifiedDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          color="primary"
                          component={RouterLink}
                          size="small"
                          to={`/cooperator/${cooperator.id}`}
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
  cooperators: PropTypes.array.isRequired,
  numberOfElements: PropTypes.number,
  totalPages: PropTypes.number,
  fetchCooperators: PropTypes.func,
  isLoading: PropTypes.bool
};

Results.defaultProps = {
  cooperators: [],
  numberOfElements: 0,
  totalPages: 0,
  isLoading: false
};

export default Results;
