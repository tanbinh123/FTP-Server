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
import getInitials from 'utils/getInitials';
import { TableToolbar } from 'components';
import Moment from 'react-moment';
import palette from 'theme/palette';

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
  const { className, page, size, order, orderBy, onRequestSort, onRequestPagination, isLoading, services, numberOfElements, totalPages, fetchServices, ...rest } = props;

  const classes = useStyles();

  const [selectedServices, setSelectedResults] = useState([]);

  const handleSelectAll = event => {
    const selectedServices = event.target.checked
      ? services.map(customer => customer.id)
      : [];

    setSelectedResults(selectedServices);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedServices.indexOf(id);
    let newSelectedServices = [];

    if (selectedIndex === -1) {
      newSelectedServices = newSelectedServices.concat(selectedServices, id);
    } else if (selectedIndex === 0) {
      newSelectedServices = newSelectedServices.concat(
        selectedServices.slice(1)
      );
    } else if (selectedIndex === selectedServices.length - 1) {
      newSelectedServices = newSelectedServices.concat(
        selectedServices.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedServices = newSelectedServices.concat(
        selectedServices.slice(0, selectedIndex),
        selectedServices.slice(selectedIndex + 1)
      );
    }

    setSelectedResults(newSelectedServices);
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
        <TableToolbar title="Todos os serviços" numSelected={selectedServices.length} />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedServices.length === services.length}
                        color="primary"
                        indeterminate={
                          selectedServices.length > 0 &&
                          selectedServices.length < services.length
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
                        Descrição
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
                            <Skeleton variant="text" width={"100%"} />
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
                      <TableCell align="right">
                        <Skeleton variant="text" width={70} />
                      </TableCell>
                    </TableRow>
                  ))}
                  { !isLoading && services.map(service => (
                    <TableRow
                      hover
                      key={service.id}
                      selected={selectedServices.indexOf(service.id) !== -1}
                      className={service.active ? classes.active : null}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedServices.indexOf(service.id) !== -1
                          }
                          color="primary"
                          onChange={event =>
                            handleSelectOne(event, service.id)
                          }
                          value={selectedServices.indexOf(service.id) !== -1}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameCell}>
                          <Avatar
                            className={classes.avatar}
                            src={service.thumbnail}
                          >
                            {getInitials(service.description)}
                          </Avatar>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to={`/service/${service.id}`}
                              variant="h6"
                            >
                              {service.description}
                            </Link>
                            <div>{service.type != null ? service.type.description : ''}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{service.active === true ? "Sim" : "Não"}</TableCell>
                      <TableCell>
                        <div>
                          <div>{service.createdBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{service.createdDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{service.lastModifiedBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{service.lastModifiedDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          color="primary"
                          component={RouterLink}
                          size="small"
                          to={`/service/${service.id}`}
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
  services: PropTypes.array.isRequired,
  numberOfElements: PropTypes.number,
  totalPages: PropTypes.number,
  fetchServices: PropTypes.func,
  isLoading: PropTypes.bool,
  onRequestSort: PropTypes.func.isRequired,
  onRequestPagination: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};

Results.defaultProps = {
  services: [],
  numberOfElements: 0,
  totalPages: 0,
  isLoading: false
};

export default Results;
