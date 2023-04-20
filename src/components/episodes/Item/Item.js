import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Paper,
  Grid,
  Stack,
  Typography,
  IconButton,
  Button,
  Tooltip,
  Snackbar,
} from '@mui/material';
import { Edit, Link as LinkIcon, Close } from '@mui/icons-material';
import { Timestamp } from 'firebase/firestore';
import EpisodeImage from '../../EpisodeImage';
import ItemChips from './ItemChips';
import Markdown from './Markdown';
import { useNavigate } from 'react-router-dom';

const Item = ({ episodeId, item }) => {
  const navigate = useNavigate();
  const { title, subtitle, description, url } = item;
  const [t] = useTranslation();
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);

  const handleCloseSuccessMessage = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessMessageVisible(false);
  };
  return (
    <Paper sx={{ padding: 2, marginBottom: 2 }}>
      <Stack spacing={0} mb={2}>
        <ItemChips item={item} />
        <Typography variant="h4">{title}</Typography>
        <Typography variant="subtitle1">{subtitle}</Typography>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <EpisodeImage
              {...item}
              onClick={() => navigate(`${episodeId}/edit`)}
            />
            <Tooltip title={t('Item.editEpisodeTooltip')}>
              <Button
                startIcon={<Edit />}
                aria-label={t('Item.editEpisode')}
                onClick={() => navigate(`${episodeId}/edit`)}
                size="large"
              >
                {t('Item.editEpisode')}
              </Button>
            </Tooltip>
            {url && (
              <>
                <CopyToClipboard text={url} onCopy={setSuccessMessageVisible}>
                  <Tooltip title={t('Item.copyEpisodeUrl.toolTip')}>
                    <Button
                      startIcon={<LinkIcon />}
                      aria-label={t('Item.copyEpisodeUrl.toolTip')}
                      size="large"
                    >
                      {t('Item.copyEpisodeUrl')}
                    </Button>
                  </Tooltip>
                </CopyToClipboard>
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={!!successMessageVisible}
                  autoHideDuration={6000}
                  onClose={handleCloseSuccessMessage}
                  message={t('Item.copyEpisodeUrl.success')}
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
              </>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Markdown text={description} truncateLength={600} />
        </Grid>
      </Grid>
    </Paper>
  );
};

Item.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    processing: PropTypes.string,
    date: PropTypes.instanceOf(Timestamp).isRequired,
    url: PropTypes.string,
  }).isRequired,
  episodeId: PropTypes.string.isRequired,
};

export default Item;
