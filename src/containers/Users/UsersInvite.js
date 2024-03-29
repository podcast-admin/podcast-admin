import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

import { db } from '../../helpers/Firebase';
import withAuth from '../../helpers/WithAuth';

const UsersInvite = () => {
  const { podcastId } = useParams();
  const navigate = useNavigate();
  const [t] = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSavePodcast = async () => {
    setIsSubmitted(true);
    if (email) {
      await updateDoc(doc(db, `podcasts/${podcastId}`), {
        invitedAdmins: arrayUnion(email),
      });

      navigate(`/podcasts/${podcastId}/users`);
    }
  };

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        padding: 2,
      }}
    >
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h3" gutterBottom>
          {t('UsersInvite.title')}
        </Typography>
        <Typography gutterBottom>{t('UsersInvite.infoText')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              label={t('UsersInvite.form.email')}
              name="email"
              value={email}
              error={isSubmitted && email === ''}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleSavePodcast}
              color="primary"
              variant="contained"
            >
              {t('UsersInvite.form.button.save')}
            </Button>
            <Button onClick={navigateBack} color="primary">
              {t('UsersInvite.form.button.back')}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default withAuth(UsersInvite);
