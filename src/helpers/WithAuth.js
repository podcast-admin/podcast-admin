import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { onAuthStateChanged } from 'firebase/auth';

import CircularProgress from '@mui/material/CircularProgress';

import { auth } from '../helpers/Firebase';

const SIGNED_IN = 'SIGNED_IN';
const SIGNED_OUT = 'SIGNED_OUT';
const LOADING = 'LOADING';

const withAuth = (Component) => (props) => {
  const [state, setState] = useState(LOADING);

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
    return <CircularProgress />;
  } else if (state === SIGNED_IN) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...props} />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default withAuth;
