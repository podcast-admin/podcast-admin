import Upload from '../../components/upload';
import withAuth from '../../helpers/WithAuth';

const EpisodeNew = () => {
  return <Upload />;
};

export default withAuth(EpisodeNew);
