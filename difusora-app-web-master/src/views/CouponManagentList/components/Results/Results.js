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
  const { className, page, size, order, orderBy, onRequestSort, onRequestPagination, isLoading, coupons, numberOfElements, totalPages, fetchCoupons, ...rest } = props;

  const classes = useStyles();

  const [selectedCoupons, setSelectedResults] = useState([]);

  const handleSelectAll = event => {
    const selectedCoupons = event.target.checked
      ? coupons.map(customer => customer.id)
      : [];

    setSelectedResults(selectedCoupons);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCoupons.indexOf(id);
    let newSelectedCoupons = [];

    if (selectedIndex === -1) {
      newSelectedCoupons = newSelectedCoupons.concat(selectedCoupons, id);
    } else if (selectedIndex === 0) {
      newSelectedCoupons = newSelectedCoupons.concat(
        selectedCoupons.slice(1)
      );
    } else if (selectedIndex === selectedCoupons.length - 1) {
      newSelectedCoupons = newSelectedCoupons.concat(
        selectedCoupons.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedCoupons = newSelectedCoupons.concat(
        selectedCoupons.slice(0, selectedIndex),
        selectedCoupons.slice(selectedIndex + 1)
      );
    }

    setSelectedResults(newSelectedCoupons);
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
        <TableToolbar title="Todos as contas de usuário" numSelected={selectedCoupons.length} />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCoupons.length === coupons.length}
                        color="primary"
                        indeterminate={
                          selectedCoupons.length > 0 &&
                          selectedCoupons.length < coupons.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'description'}
                        direction={orderBy === 'description' ? order : 'asc'}
                        onClick={createSortHandler('description')}
                        IconComponent={SortIcon}>
                        Nome
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'discount'}
                        direction={orderBy === 'discount' ? order : 'asc'}
                        onClick={createSortHandler('discount')}
                        IconComponent={SortIcon}>
                        Desconto
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'quantity'}
                        direction={orderBy === 'quantity' ? order : 'asc'}
                        onClick={createSortHandler('quantity')}
                        IconComponent={SortIcon}>
                        Quantidade
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'limit'}
                        direction={orderBy === 'limit' ? order : 'asc'}
                        onClick={createSortHandler('limit')}
                        IconComponent={SortIcon}>
                        Limite de uso
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
                  {coupons.map(coupon => (
                    <TableRow
                      hover
                      key={coupon.id}
                      selected={selectedCoupons.indexOf(coupon.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedCoupons.indexOf(coupon.id) !== -1
                          }
                          color="primary"
                          onChange={event =>
                            handleSelectOne(event, coupon.id)
                          }
                          value={selectedCoupons.indexOf(coupon.id) !== -1}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameCell}>
                          <Avatar
                            className={classes.avatar}
                            src={coupon.thumbnail ? coupon.thumbnail.uri : ''}
                          >
                            {getInitials(coupon.description)}
                          </Avatar>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to={`/coupon/${coupon.id}`}
                              variant="h6"
                            >
                              {coupon.description}
                            </Link>
                            <div>{coupon.shortName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{coupon.discount}</TableCell>
                      <TableCell>{coupon.quantity}</TableCell>
                      <TableCell>{coupon.limit}</TableCell>
                      <TableCell>{coupon.active === true ? "Sim" : "Não"}</TableCell>
                      <TableCell>
                        <div>
                          <div>{coupon.createdBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{coupon.createdDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{coupon.lastModifiedBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{coupon.lastModifiedDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          color="primary"
                          component={RouterLink}
                          size="small"
                          to={`/coupon/${coupon.id}`}
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
  coupons: PropTypes.array.isRequired,
  numberOfElements: PropTypes.number,
  totalPages: PropTypes.number,
  fetchCoupons: PropTypes.func,
  isLoading: PropTypes.bool
};

Results.defaultProps = {
  coupons: [],
  numberOfElements: 0,
  totalPages: 0,
  isLoading: false
};

export default Results;
