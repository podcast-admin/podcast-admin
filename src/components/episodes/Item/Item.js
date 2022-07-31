import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';

import {
  Paper,
  Grid,
  Stack,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import { db } from '../../../helpers/Firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

class Item extends Component {
  reprocessAudio = async () => {
    const { podcastId, episodeId } = this.props;

    await updateDoc(doc(db, 'podcasts', podcastId, 'episodes', episodeId), {
      processing: 'restart',
    });
  };

  renderProcessingStatusButton = () => {
    const { item } = this.props;
    if (item.processing === 'done') {
      return (
        <Tooltip title="Audio-Datei neu erstellen">
          <IconButton
            aria-label="reprocess"
            onClick={() => {
              this.reprocessAudio();
            }}
            size="large"
          >
            <ReplayIcon />
          </IconButton>
        </Tooltip>
      );
    }
    if (item.processing === 'restart') {
      return (
        <Tooltip title="Audio-Datei wird neu erstellt...">
          <IconButton
            aria-label="reprocess"
            onClick={() => {
              this.reprocessAudio();
            }}
            size="large"
          >
            <HourglassEmptyIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return false;
  };

  render() {
    const {
      item: { date, title, subtitle, image, description },
      episodeId,
    } = this.props;

    return (
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Stack spacing={0} mb={2}>
          <Typography variant="subtitle1">
            <Moment format="DD.MM.YYYY">{date.toDate()}</Moment>
          </Typography>
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
            <Tooltip title="Episode bearbeiten">
              <IconButton
                aria-label="edit"
                href={`episodes/${episodeId}/edit`}
                size="large"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            {this.renderProcessingStatusButton()}
          </Grid>
          <Grid item xs={9}>
            <Typography variant="body1" component="div">
              <ReactMarkdown linkTarget="_blank">{description}</ReactMarkdown>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

Item.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    processing: PropTypes.string,
    date: PropTypes.instanceOf(Timestamp).isRequired,
  }).isRequired,
  podcastId: PropTypes.string.isRequired,
  episodeId: PropTypes.string.isRequired,
};

export default Item;
