import React from 'react';
import { useParams } from 'react-router-dom';
import withAuth from '../../helpers/WithAuth';

import PodcastForm from '../../components/PodcastForm';

const PodcastEdit = () => {
  const { podcastId } = useParams();

  return <PodcastForm podcastId={podcastId} />;
};

export default withAuth(PodcastEdit);
