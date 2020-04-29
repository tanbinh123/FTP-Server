import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import useRouter from 'utils/useRouter';
import axios from 'utils/axios';
import { Page } from 'components';
import { LinearProgress, Snackbar, Typography} from '@material-ui/core';
import { Alert } from 'components';
import CalendarForm from './components/Form';

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

const CalendarManagentDetails = () => {
  const classes = useStyles();

  const initialValues = {
    place: null,
    cooperator: null,
    service: null,
    date: new Date(),
    price: 0,
    exception: false,
    active: false,
    times: []
  };

  const [calendar, setCalendar] = useState({ ...initialValues });
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const router = useRouter();
  
  useEffect(() => {
    let mounted = true;
    
    if(!router.match.params.id) return;
    
    if (mounted) 
      fetchCalendar(router.match.params.id);

    return () => {
      mounted = false;
    };
  }, []);

  const fetchCalendar = (id) => {
    setLoading(true);
    axios.get('/v1/calendar/' + id).then(response => {
      setCalendar(response.data);
      setLoading(false);
      setIsError(false);
    }).catch((error) => {
      setLoading(false);
      setIsError(true);
      setError(error.response.data);
    });
  };

  const saveCalendar = (calendar) => {
    calendar.place = calendar.place ? calendar.place.id : null;
    calendar.cooperator = calendar.cooperator ? calendar.cooperator.id : null;
    calendar.service = calendar.service ? calendar.service.id : null;
    setLoading(true);
    axios({
      method: calendar.id ? 'PUT' : 'POST',
      url: '/v1/calendar' + (calendar.id ? `/${calendar.id}` : ''),
      data: calendar
    }).then(response => {
      setCalendar(response.data);
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
      title="Agenda"
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
        <CalendarForm calendar={calendar} onSubmit={saveCalendar} />
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

export default CalendarManagentDetails
;
