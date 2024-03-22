import { Stack, Chip } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Item = ({
  item: {
    date,
    title,
    subtitle,
    image,
    description,
    url,
    intro,
    outro,
    processing,
    transcript,
  },
}) => {
  const [t] = useTranslation();

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={0}
      mb={1}
      sx={{ flexWrap: 'wrap', gap: 1 }}
    >
      {date.toDate() > new Date() ? (
        <Chip
          label={t('ItemChips.date.scheduled', {
            val: date.toDate(),
            formatParams: {
              val: {
                weekday: 'short',
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
              },
            },
          })}
          size="small"
        />
      ) : (
        <Chip
          label={t('ItemChips.date.published', {
            val: date.toDate(),
            formatParams: {
              val: {
                weekday: 'short',
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
              },
            },
          })}
          color="success"
          size="small"
        />
      )}
      {!url && (
        <Chip label={t('ItemChips.missing.audio')} color="error" size="small" />
      )}
      {!image && (
        <Chip label={t('ItemChips.missing.image')} color="error" size="small" />
      )}
      {!description && (
        <Chip
          label={t('ItemChips.missing.description')}
          color="error"
          size="small"
        />
      )}
      {!title && (
        <Chip label={t('ItemChips.missing.title')} color="error" size="small" />
      )}
      {!subtitle && (
        <Chip
          label={t('ItemChips.missing.subtitle')}
          color="error"
          size="small"
        />
      )}

      {intro && <Chip label={t('ItemChips.intro', { intro })} size="small" />}
      {outro && <Chip label={t('ItemChips.outro', { outro })} size="small" />}
      {processing === 'restart' && (
        <Chip label={t('ItemChips.processing')} color="primary" size="small" />
      )}
      {transcript && transcript.status === 'done' && (
        <Chip label={t('ItemChips.transcript.done')} size="small" />
      )}
      {transcript && transcript.status === 'processing' && (
        <Chip label={t('ItemChips.transcript.processing')} size="small" />
      )}
    </Stack>
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
};

export default Item;
