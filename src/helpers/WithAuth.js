import { Stack, CircularProgress } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { auth } from '../helpers/Firebase';

const SIGNED_IN = 'SIGNED_IN';
const SIGNED_OUT = 'SIGNED_OUT';
const LOADING = 'LOADING';

const withAuth = (Component) => (props) => {
  const [state, setState] = useState(LOADING);
  const location = useLocation();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setState(SIGNED_IN);
      } else {
        setState(SIGNED_OUT);
      }
    });
  }, []);

  if (state === LOADING) {
    return (
      <Stack mt={2} alignItems="center">
        <CircularProgress />
      </Stack>
    );
  } else if (state === SIGNED_IN) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...props} />;
  } else {
    return (
      <Navigate to="/login" state={{ redirectTo: location.pathname }} replace />
    );
  }
};

export default withAuth;
