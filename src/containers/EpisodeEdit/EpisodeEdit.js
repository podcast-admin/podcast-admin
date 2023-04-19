import { useParams } from 'react-router-dom';
import Upload from '../../components/upload';
import withAuth from '../../helpers/WithAuth';
import LoadingWrapper from '../../components/LoadingWrapper/LoadingWrapper';
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
