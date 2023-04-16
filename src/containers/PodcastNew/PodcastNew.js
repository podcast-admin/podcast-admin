import { httpsCallable } from 'firebase/functions';
import withAuth from '../../helpers/WithAuth';
import { functions, auth } from '../../helpers/Firebase';

import PodcastForm from '../../components/PodcastForm';
import { useNavigate } from 'react-router-dom';

const PodcastNew = () => {
  const navigate = useNavigate();
  const updateCustomClaims = httpsCallable(functions, 'updateCustomClaims');

  const onSave = async () => {
    await updateCustomClaims();
    await auth.currentUser.getIdToken(true);
    navigate('/');
  };
  return <PodcastForm onSave={onSave} />;
};

export default withAuth(PodcastNew);
