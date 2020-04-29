import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import useRouter from 'utils/useRouter';
import axios from 'utils/axios';
import { Page } from 'components';
import { LinearProgress, Snackbar, Typography} from '@material-ui/core';
import { Alert } from 'components';
import ServerForm from './components/Form';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  },
  alert: {
    marginBottom: theme.spacing(3)
  },
  formGroup: {
    marginBottom: theme.spacing(3)
  },
  fieldGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  textField: {
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  }
}));

const ServerManagentDetails = () => {
  const classes = useStyles();

  const initialValues = {
    fullName: '',
    serverType: ''
  };

  const [server, setServer] = useState({ ...initialValues });
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const router = useRouter();
  
  useEffect(() => {
    let mounted = true;
    
    if(!router.match.params.id) return;
    
    if (mounted) 
      fetchServer(router.match.params.id);

    return () => {
      mounted = false;
    };
  }, []);

  const fetchServer = (id) => {
    setLoading(true);
    axios.get(`/api/v1/server/${id}`).then(response => {
      setServer(response.data);
      setLoading(false);
      setIsError(false);
    }).catch((error) => {
      setLoading(false);
      setIsError(true);
      setError(error.response.data);
    });
  };

  const saveServer = (server) => {
    setLoading(true);
    server.thumbnail = server.thumbnail != undefined ? server.thumbnail.key : null;
    axios({
      method: server.id ? 'PUT' : 'POST',
      url: '/api/v1/server' + (server.id ? `/${server.id}` : ''),
      data: server
    }).then(response => {
      setServer(response.data);
      setLoading(false);
      setIsError(false);
      setOpenSnackbar(true);
    }).catch((error) => {
      setLoading(false);
      setIsError(true);
      setError(error.response.data);
    });
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Page
      className={classes.root}
      title="Servers"
    >
      { (!isLoading && isError) && 
        <Alert
          variant="error"
          className={classes.alert}
          message={error.error}
        />
      }
      { isLoading && <LinearProgress /> }
      { (!isLoading && !isError) && 
        <ServerForm server={server} onSubmit={saveServer} />
      }
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        autoHideDuration={3000}
        message={
          <Typography
            color="inherit"
            variant="h6"
          >
            Dados salvo com sucesso.
          </Typography>
        }
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />
    </Page>
  );
};

export default ServerManagentDetails;
