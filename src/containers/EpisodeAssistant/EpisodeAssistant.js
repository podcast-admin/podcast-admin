import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import withAuth from '../../helpers/WithAuth';

const EpisodeAssistant = () => {
  const { podcastId, episodeId } = useParams();

  return <Box>EpisodeAssistant for {episodeId}</Box>;
};

export default withAuth(EpisodeAssistant);
