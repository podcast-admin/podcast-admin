import { useParams } from 'react-router-dom';

import LoadingWrapper from '../../components/LoadingWrapper';
import Upload from '../../components/Upload';
import withAuth from '../../helpers/WithAuth';
import useEpisodeQuery from '../../hooks/useEpisodeQuery';

const EditEpisode = () => {
  const { podcastId, episodeId } = useParams();
  const { data, isLoading, isSuccess, isError } = useEpisodeQuery({
    podcastId,
    episodeId,
  });

  return (
    <LoadingWrapper
      isLoading={isLoading}
      isSuccess={isSuccess}
      isError={isError}
    >
      <Upload episodeSnap={data} podcastId={podcastId} />
    </LoadingWrapper>
  );
};

export default withAuth(EditEpisode);
