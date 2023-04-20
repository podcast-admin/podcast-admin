import { useParams } from 'react-router-dom';

import Upload from '../../components/Upload';
import withAuth from '../../helpers/WithAuth';

const EpisodeNew = () => {
  const { podcastId } = useParams();
  return <Upload podcastId={podcastId} />;
};

export default withAuth(EpisodeNew);
