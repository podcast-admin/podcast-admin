import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import withAuth from '../../helpers/WithAuth';

import { Container, Stack, Button, Typography } from '@mui/material';

import ListOfUsers from './components/ListOfUsers';
import ListOfInvites from './components/ListOfInvites';

const UsersOverview = () => {
  const navigate = useNavigate();
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
          {t('UsersOverview.title')}
        </Typography>
        <Button onClick={() => navigate('invite')}>
          {t('UsersOverview.inviteButtonLabel')}
        </Button>
      </Stack>

      <ListOfUsers />

      <Typography variant="h3" gutterBottom mt={5}>
        {t('ListOfInvites.title')}
      </Typography>
      <ListOfInvites />
    </Container>
  );
};

export default withAuth(UsersOverview);
