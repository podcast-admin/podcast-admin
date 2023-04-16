import React, { useEffect, useState } from 'react';
import { Navigate, Link as LinkRouter } from 'react-router-dom';

import { CircularProgress, Stack, Link } from '@mui/material';

import { auth } from '../../helpers/Firebase';
import withAuth from '../../helpers/WithAuth';

const Home = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const idTokenResult = await auth.currentUser.getIdTokenResult();
      setPodcasts(idTokenResult.claims.podcasts || []);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Stack mt={2} alignItems="center">
        <CircularProgress />
      </Stack>
    );
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
            <Link component={LinkRouter} key={p} to={`/podcasts/${p}/episodes`}>
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
