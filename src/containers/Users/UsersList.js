import React from 'react';
import { useTranslation } from 'react-i18next';

import { Container, Stack, Button, Typography } from '@mui/material';

import ListOfUsers from './components/ListOfUsers';
import ListOfInvites from './components/ListOfInvites';

const UsersList = () => {
  const [t] = useTranslation();

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: 2,
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h3" gutterBottom>
          {t('UsersList.title')}
        </Typography>
        <Button href="users/invite">{t('UsersList.inviteButtonLabel')}</Button>
      </Stack>

      <ListOfUsers />

      <Typography variant="h3" gutterBottom mt={5}>
        {t('UsersList.title')}
      </Typography>
      <ListOfInvites />
    </Container>
  );
};

export default UsersList;
