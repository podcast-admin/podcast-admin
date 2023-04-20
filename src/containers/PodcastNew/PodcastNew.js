import { httpsCallable } from 'firebase/functions';
import { useNavigate } from 'react-router-dom';

import PodcastForm from '../../components/PodcastForm';
import { functions, auth } from '../../helpers/Firebase';
import withAuth from '../../helpers/WithAuth';

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
