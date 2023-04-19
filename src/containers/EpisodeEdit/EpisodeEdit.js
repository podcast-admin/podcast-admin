import { useParams } from 'react-router-dom';
import Upload from '../../components/upload';
import withAuth from '../../helpers/WithAuth';

const EditEpisode = () => {
  const { podcastId, episodeId } = useParams();
  return <Upload podcastId={podcastId} episodeId={episodeId} />;
};

export default withAuth(EditEpisode);
