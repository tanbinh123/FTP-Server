import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import useRouter from 'utils/useRouter';
import axios from 'utils/axios';
import { Page } from 'components';
import { LinearProgress, Snackbar, Typography, Tab, Tabs, Divider} from '@material-ui/core';
import { Alert } from 'components';
import { Form, Store, Usage } from './components';

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

const CouponManagentDetails = () => {
  const classes = useStyles();

  const initialValues = {
    description: '',
    image: null,
    thumbnail: null,
    annotation: '',
    discount: 0,
    quantity: 0,
    limit: 0,
    expirationAt: null,
    active: false
  };

  const [coupon, setCoupon] = useState({ ...initialValues });
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
      fetchCoupon(router.match.params.id);

    return () => {
      mounted = false;
    };
  }, []);

  const fetchCoupon = (id) => {
    setLoading(true);
    axios.get('/marketplace-coupon-service/v1/coupon/' + id).then(response => {
      setCoupon(response.data);
      setLoading(false);
      setIsError(false);
    }).catch((error) => {
      setLoading(false);
      setIsError(true);
      setError(error.response.data);
    });
  };

  const saveCoupon = (coupon) => {
    coupon.thumbnail = coupon.thumbnail != undefined ? coupon.thumbnail.key : null;
    coupon.image = coupon.image != undefined ? coupon.image.key : null;
    setLoading(true);
    axios({
      method: coupon.id ? 'PUT' : 'POST',
      url: '/marketplace-coupon-service/v1/coupon' + (coupon.id ? `/${coupon.id}` : ''),
      data: coupon
    }).then(response => {
      setCoupon(response.data);
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
      title="Cupom"
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
            <Tab disabled={coupon.id == undefined} label={<Typography variant="body1">
                          Lojas
                        </Typography>}/>
            <Tab disabled={coupon.id == undefined} label={<Typography variant="body1">
                          Uso
                        </Typography>}/>
        </Tabs>
        <div className={classes.content}>
          {tab === 0 && <Form coupon={coupon} onSubmit={saveCoupon} /> }
          { coupon.id != undefined && (<>
            {tab === 1 && <Store coupon={coupon} /> }
            {tab === 2 && <Usage coupon={coupon} /> }
          </>)}
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

export default CouponManagentDetails;
