import { Add, Close } from '@mui/icons-material';
import {
  Container,
  Fab,
  Typography,
  Tooltip,
  Snackbar,
  IconButton,
  Button,
  Grid,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

import Episodes from '../../components/episodes/Episodes';
import withAuth from '../../helpers/WithAuth';

const ListEpisodes = () => {
  const navigate = useNavigate();
  const { podcastId } = useParams();
  const [t] = useTranslation();
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);

  const handleCloseSuccessMessage = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessMessageVisible(false);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: { xs: 2, sm: 4 },
      }}
    >
      <Grid container justifyContent="space-between" mb={2} alignItems="center">
        <Typography variant="h3">{t('ListEpisodes.title')}</Typography>
        <CopyToClipboard
          text={`https://podcast-admin.firebaseapp.com/feed/${podcastId}`}
          onCopy={setSuccessMessageVisible}
        >
          <Button>{t('ListEpisodes.copyFeedURL.buttonLabel')}</Button>
        </CopyToClipboard>
      </Grid>
      <Episodes podcastId={podcastId} />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={!!successMessageVisible}
        autoHideDuration={6000}
        onClose={handleCloseSuccessMessage}
        message={t('ListEpisodes.copyFeedURL.successMessage')}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSuccessMessage}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
      <Tooltip title={t('ListEpisodes.createNew')}>
        <Fab
          sx={{
            margin: 0,
            top: 'auto',
            right: 40,
            bottom: 40,
            left: 'auto',
            position: 'fixed',
          }}
          color="primary"
          aria-label="add"
          onClick={() => navigate('new')}
        >
          <Add />
        </Fab>
      </Tooltip>
    </Container>
  );
};

ListEpisodes.propTypes = {
  podcastId: PropTypes.string,
};

export default withAuth(ListEpisodes);
