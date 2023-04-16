import React, { useState, useEffect } from 'react';
import { useParams, Link as LinkRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Typography, Link, CircularProgress, Stack } from '@mui/material';
import { db } from '../../helpers/Firebase';

import Item from './Item';

const Episodes = () => {
  const [t] = useTranslation();
  const { podcastId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    episodes: [],
  });

  useEffect(() => {
    const episodesRef = collection(db, 'podcasts', podcastId, 'episodes');
    const q = query(episodesRef, orderBy('date', 'desc'));

    return onSnapshot(q, (snapshot) => {
      setState({
        episodes: snapshot.docs,
      });
      setIsLoading(false);
    });
  }, [podcastId]);

  if (isLoading) {
    return (
      <Stack alignItems="center">
        <CircularProgress />
      </Stack>
    );
  } else if (!isLoading && state.episodes.length > 0) {
    return state.episodes.map((doc) => (
      <Item key={doc.id} episodeId={doc.id} item={doc.data()} />
    ));
  } else {
    return (
      <Typography align="center">
        {t('Episodes.no-episodes.text')}{' '}
        <Link component={LinkRouter} to="new">
          {t('Episodes.no-episodes.link')}
        </Link>
      </Typography>
    );
  }
};

export default Episodes;
