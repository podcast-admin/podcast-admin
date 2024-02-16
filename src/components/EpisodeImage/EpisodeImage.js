import { Box } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import missingImage from '../../images/missingImage.svg';

const EpisodeImage = ({ image, imageAlternatives, title, onClick, sx }) => {
  return (
    <Box
      component={LazyLoadImage}
      sx={{ width: '100%', cursor: onClick ? 'pointer' : undefined, ...sx }}
      src={image || missingImage}
      srcSet={imageAlternatives?.map((i) => {
        return `${i.url} ${i.width}w,`;
      })}
      alt={title}
      onClick={onClick}
    />
  );
};

export default EpisodeImage;
