import React from 'react';
import { httpsCallable } from 'firebase/functions';
import withAuth from '../../helpers/WithAuth';
import { functions, auth } from '../../helpers/Firebase';

import PodcastForm from '../../components/PodcastForm';

const updateCustomClaims = httpsCallable(functions, 'updateCustomClaims');

const onSave = async () => {
  await updateCustomClaims();
  await auth.currentUser.getIdToken(true);
  window.location.assign('/');
};

const PodcastNew = () => {
  return <PodcastForm onSave={onSave} />;
};

export default withAuth(PodcastNew);
