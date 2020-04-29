import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import axios from 'utils/axios';
import { Page, Label } from 'components';
import { Header, Results } from './components';
import { colors } from '@material-ui/core';
import { Alert } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const ServerManagentList = () => {
  const classes = useStyles();

  const [servers, setServers] = useState([]);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('serverName');

  const [numberOfElements, setNumberOfElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    let mounted = true;

    if (mounted) 
      fetchServer(page, size, order, orderBy);

    return () => {
      mounted = false;
    };
  }, []);

  const fetchServer = (page, size, order, orderBy) => {
    const sort = orderBy + ',' + order
    let params = {
      page, size, sort
    }

    setLoading(true);
    setIsError(false);
    setServers([]);
    setOrder(order);
    setOrderBy(orderBy);

    axios.get('/api/v1/server', { params }).then(response => {
      handleRequestSuccess(response);
    }).catch((error) => {
      handleRequestError(error);
    }).finally(() => {
      handleRequestFinally();
    });
  };

  const handleRequestSuccess = (response) => {
    setServers(response.data.content);
    setNumberOfElements(response.data.numberOfElements);
    setTotalPages(response.data.totalPages);
    setPage(response.data.number);
    setSize(response.data.size);
    setIsError(false);
  }

  const handleRequestError = (error) => {
    setIsError(true);
    setError(error.response.data);
  }

  const handleRequestFinally = () => {
    setLoading(false);
  }

  const handleRequestSort = async (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    fetchServer(page, size, (isAsc ? 'desc' : 'asc'), property);
  };

  const handleRequestPagination = (event, page, size) => {
    fetchServer(page, size, order, orderBy);
  };

  const handleFilter = () => {console.log('handleFilter')};
  const handleSearch = () => {};

  return (
    <Page
      className={classes.root}
      title="Servidores"
    >
      { !isLoading && isError && 
        <Alert
          variant="error"
          className={classes.alert}
          message={error.error}
        />
      }
      <Header
        onFilter={handleFilter}
        onSearch={handleSearch}
        numberOfElements={numberOfElements}
      />
      {(!isError) && (<>
      <Results
        className={classes.results}
        servers={servers}
        numberOfElements={numberOfElements}
        totalPages={totalPages}
        fetchServer={fetchServer}
        isLoading={isLoading}
        onRequestSort={handleRequestSort}
        onRequestPagination={handleRequestPagination}
        order={order}
        orderBy={orderBy}
        page={page}
        size={size}
      />
      </>)}
    </Page>
  );
};

export default ServerManagentList;
