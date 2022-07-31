import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { CircularProgress, Stack, Link } from '@mui/material';

import { auth } from '../../helpers/Firebase';
import withAuth from '../../helpers/WithAuth';

const LOADING = 'LOADING';

const Home = () => {
  const [podcasts, setPodcasts] = useState(LOADING);

  useEffect(() => {
    const fetchData = async () => {
      const idTokenResult = await auth.currentUser.getIdTokenResult();
      setPodcasts(idTokenResult.claims.podcasts || []);
    };

    fetchData();
  }, []);

  if (podcasts === LOADING) {
    return <CircularProgress />;
  } else if (podcasts.length === 0) {
    return <Navigate to="/podcasts/new" replace />;
  } else if (podcasts.length === 1) {
    return <Navigate to={`/podcasts/${podcasts[0]}/episodes`} replace />;
  } else if (podcasts.length > 1) {
    return (
      <>
        <p>Mehrere Podcasts</p>
        <Stack>
          {podcasts.map((p) => (
            <Link key={p} href={`/podcasts/${p}/episodes`}>
              {p}
            </Link>
          ))}
        </Stack>
      </>
    );
  } else {
  }
};

export default withAuth(Home);
