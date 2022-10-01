import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Paper,
  Grid,
  Stack,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';
import { Edit, Link as LinkIcon, Close } from '@mui/icons-material';
import { Timestamp } from 'firebase/firestore';

import ItemChips from './ItemChips';

const Item = ({ episodeId, item }) => {
  const { title, subtitle, image, description, url } = item;
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
        <Grid item xs={3}>
          <LazyLoad>
            <Box
              component="img"
              sx={{ width: '100%' }}
              src={image}
              alt={title}
            />
          </LazyLoad>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Tooltip title={t('Item.editEpisode')}>
              <IconButton
                aria-label={t('Item.editEpisode')}
                href={`episodes/${episodeId}/edit`}
                size="large"
              >
                <Edit />
              </IconButton>
            </Tooltip>
            {url && (
              <>
                <CopyToClipboard text={url} onCopy={setSuccessMessageVisible}>
                  <Tooltip title={t('Item.copyEpisodeUrl.toolTip')}>
                    <IconButton
                      aria-label={t('Item.copyEpisodeUrl.toolTip')}
                      size="large"
                    >
                      <LinkIcon />
                    </IconButton>
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
        <Grid item xs={9}>
          <Typography variant="body1" component="div">
            <ReactMarkdown linkTarget="_blank">{description}</ReactMarkdown>
          </Typography>
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
