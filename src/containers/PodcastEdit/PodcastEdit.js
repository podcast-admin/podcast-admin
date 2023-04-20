import React from 'react';
import { useParams } from 'react-router-dom';

import PodcastForm from '../../components/PodcastForm';
import withAuth from '../../helpers/WithAuth';

const PodcastEdit = () => {
  const { podcastId } = useParams();

  return <PodcastForm podcastId={podcastId} />;
};

export default withAuth(PodcastEdit);
