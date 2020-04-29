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
import EditIcon from '@material-ui/icons/Edit';
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
  const { className, page, size, order, orderBy, onRequestSort, onRequestPagination, isLoading, documents, numberOfElements, totalPages, fetchdocuments, ...rest } = props;

  const classes = useStyles();

  const [selectedDocuments, setSelectedResults] = useState([]);

  const handleSelectAll = event => {
    const selectedDocuments = event.target.checked
      ? documents.map(customer => customer.id)
      : [];

    setSelectedResults(selectedDocuments);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedDocuments.indexOf(id);
    let newSelectedDocuments = [];

    if (selectedIndex === -1) {
      newSelectedDocuments = newSelectedDocuments.concat(selectedDocuments, id);
    } else if (selectedIndex === 0) {
      newSelectedDocuments = newSelectedDocuments.concat(
        selectedDocuments.slice(1)
      );
    } else if (selectedIndex === selectedDocuments.length - 1) {
      newSelectedDocuments = newSelectedDocuments.concat(
        selectedDocuments.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedDocuments = newSelectedDocuments.concat(
        selectedDocuments.slice(0, selectedIndex),
        selectedDocuments.slice(selectedIndex + 1)
      );
    }

    setSelectedResults(newSelectedDocuments);
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
        <TableToolbar title="Documents listed" numSelected={selectedDocuments.length} />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedDocuments.length === documents.length}
                        color="primary"
                        indeterminate={
                          selectedDocuments.length > 0 &&
                          selectedDocuments.length < documents.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'documentName'}
                        direction={orderBy === 'documentName' ? order : 'asc'}
                        onClick={createSortHandler('documentName')}
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
                  {documents.map(document => (
                    <TableRow
                      hover
                      key={document.id}
                      selected={selectedDocuments.indexOf(document.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedDocuments.indexOf(document.id) !== -1
                          }
                          color="primary"
                          onChange={event =>
                            handleSelectOne(event, document.id)
                          }
                          value={selectedDocuments.indexOf(document.id) !== -1}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameCell}>
                          <Avatar
                            className={classes.avatar}
                            src={document.avatar ? document.avatar.uri : ''}
                          >
                            {getInitials(document.documentName + ' ' + document.lastName)}
                          </Avatar>
                          <div>
                            {document.documentName}
                            <div>{document.lastName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                      <div>
                        {document.documentType.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{document.createdBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{document.createdDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{document.lastModifiedBy}</div>
                          <Moment format="DD/MM/YYYY HH:mm:ss" local>{document.lastModifiedDate}</Moment>
                        </div>
                      </TableCell>
                      <TableCell>
                        <IconButton component={RouterLink} to={`document/${document.id}`}
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
  documents: PropTypes.array.isRequired,
  numberOfElements: PropTypes.number,
  totalPages: PropTypes.number,
  fetchdocuments: PropTypes.func,
  isLoading: PropTypes.bool
};

Results.defaultProps = {
  documents: [],
  numberOfElements: 0,
  totalPages: 0,
  isLoading: false
};

export default Results;
