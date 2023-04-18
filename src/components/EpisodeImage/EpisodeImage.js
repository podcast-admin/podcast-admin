import LazyLoad from 'react-lazyload';
import { Box } from '@mui/material';

const EpisodeImage = ({ image, imageAlternatives, title, onClick, sx }) => {
  return (
    <LazyLoad>
      <Box
        component="img"
        sx={{ width: '100%', cursor: onClick ? 'pointer' : undefined, ...sx }}
        src={image}
        srcSet={imageAlternatives?.map((i) => {
          return `${i.url} ${i.width}w,`;
        })}
        alt={title}
        onClick={onClick}
      />
    </LazyLoad>
  );
};

export default EpisodeImage;
