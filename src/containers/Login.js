import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { httpsCallable } from 'firebase/functions';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { Button, Container, Paper, Typography } from '@mui/material';

import { functions, auth } from '../helpers/Firebase';

const Login = (props) => {
  const processInvites = httpsCallable(functions, 'users-processInvites');
  const navigate = useNavigate();
  const [t] = useTranslation();

  const handleSignIn = () => {
    signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then(async () => {
        const result = await processInvites();
        const { shouldRefreshIdToken } = result.data;
        if (shouldRefreshIdToken) {
          await auth.currentUser.getIdToken(true);
        }
        navigate('/');
      })
      .catch(() => {
        // TODO: Error handling
      });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: { xs: 2, md: 4 },
      }}
    >
      <Paper
        sx={{
          padding: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          {t('Login.title')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('Login.text')}
        </Typography>
        <Button onClick={handleSignIn}>{t('Login.title')}</Button>
      </Paper>
    </Container>
  );
};

export default Login;
