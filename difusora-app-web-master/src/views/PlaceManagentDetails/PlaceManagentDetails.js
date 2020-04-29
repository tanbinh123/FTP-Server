import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import useRouter from 'utils/useRouter';
import axios from 'utils/axios';
import { Page } from 'components';
import { LinearProgress, Snackbar, Typography} from '@material-ui/core';
import { Alert } from 'components';
import PlaceForm from './components/Form';

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

const PlaceManagentDetails = () => {
  const classes = useStyles();

  const initialValues = {
    fullName: '',
    phoneNumber: '',
    mobileNumber: '',
    zipCode: '',
    street: '',
    number: '',
    district: '',
    reference: ''
  };

  const [place, setPlace] = useState({ ...initialValues });
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const router = useRouter();
  
  useEffect(() => {
    let mounted = true;
    
    if(!router.match.params.id) return;
    
    if (mounted) 
      fetchPlace(router.match.params.id);

    return () => {
      mounted = false;
    };
  }, []);

  const fetchPlace = (id) => {
    setLoading(true);
    axios.get('/v1/place/' + id).then(response => {
      setPlace(response.data);
      setLoading(false);
      setIsError(false);
    }).catch((error) => {
      setLoading(false);
      setIsError(true);
      setError(error.response.data);
    });
  };

  const savePlace = (place) => {
    setLoading(true);
    axios({
      method: place.id ? 'PUT' : 'POST',
      url: '/v1/place' + (place.id ? `/${place.id}` : ''),
      data: place
    }).then(response => {
      setPlace(response.data);
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
      title="Lugares"
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
        <PlaceForm place={place} onSubmit={savePlace} />
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

export default PlaceManagentDetails;
