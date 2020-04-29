import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import useRouter from 'utils/useRouter';
import axios from 'utils/axios';
import { Page } from 'components';
import { LinearProgress, Snackbar, Typography, Tab, Tabs, Divider} from '@material-ui/core';
import { Alert } from 'components';
import { Form, Reviews } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
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

const CooperatorManagentDetails = () => {
  const classes = useStyles();

  const initialValues = {
    fullName: '',
    register: '',
    shortName: '',
    thumbnail: '',
    annotation: '',
    active: false,
    services: []
  };

  const [cooperator, setCooperator] = useState({ ...initialValues });
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [tab, setTab] = React.useState(0);
  
  const router = useRouter();
  
  useEffect(() => {
    let mounted = true;
    
    if(!router.match.params.id) return;
    
    if (mounted) 
      fetchCooperator(router.match.params.id);

    return () => {
      mounted = false;
    };
  }, []);

  const fetchCooperator = (id) => {
    setLoading(true);
    axios.get('/v1/cooperator/' + id).then(response => {
      setCooperator(response.data);
      setLoading(false);
      setIsError(false);
    }).catch((error) => {
      setLoading(false);
      setIsError(true);
      setError(error.response.data);
    });
  };

  const saveCooperator = (cooperator) => {
    cooperator.services = cooperator.services.map(service => service.id);
    setLoading(true);
    axios({
      method: cooperator.id ? 'PUT' : 'POST',
      url: '/v1/cooperator' + (cooperator.id ? `/${cooperator.id}` : ''),
      data: cooperator
    }).then(response => {
      setCooperator(response.data);
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

  const handleTabsChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Page
      className={classes.root}
      title="Colaboradores"
    >
      { (!isLoading && isError) && 
        <Alert
          variant="error"
          className={classes.alert}
          message={error.error}
        />
      }
      { isLoading && <LinearProgress /> }
      { (!isLoading && !isError) && <>
        <Tabs
          onChange={handleTabsChange}
          scrollButtons="auto"
          value={tab}
          variant="scrollable">
            <Tab label={<Typography variant="body1">
                          Geral
                        </Typography>}/>
            <Tab label={<Typography variant="body1">
                          Avaliações
                        </Typography>}/>
        </Tabs>
        <div className={classes.content}>
          {tab === 0 && <Form cooperator={cooperator} onSubmit={saveCooperator} /> }
          {tab === 1 && <Reviews cooperator={cooperator} /> }
        </div>
      </>}
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

export default CooperatorManagentDetails;
