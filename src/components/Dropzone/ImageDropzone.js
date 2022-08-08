import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@mui/material';
import { Publish } from '@mui/icons-material/';
import { alpha } from '@mui/material/styles';

import Dropzone from './';

const ImageDropzone = (props) => {
  const { sx, imageSrc } = props;
  const [t] = useTranslation();
  return (
    <Dropzone
      sx={{
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: 'contain',
        justifyContent: 'flex-end',
        ...sx,
      }}
    >
      <Stack
        direction="column"
        justifyContent="flex-end"
        alignItems="center"
        sx={{
          backgroundColor: (theme) => alpha(theme.palette.common.white, 0.7),
          width: '100%',
          paddingY: 1,
        }}
      >
        <Publish />
        <Typography gutterBottom variant="button">
          {t('ImageDropzone.label')}
        </Typography>
      </Stack>
    </Dropzone>
  );
};

export default ImageDropzone;
