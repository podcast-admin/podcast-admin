import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { Typography, Link } from '@mui/material';
import firebaseApp from '../../helpers/Firebase';

import Item from './Item';

const Episodes = (props) => {
  const [t] = useTranslation();
  const { podcastId } = useParams();
  const [state, setState] = useState({
    episodes: [],
  });

  const db = getFirestore(firebaseApp);
  const episodesRef = collection(db, 'podcasts', podcastId, 'episodes');
  const q = query(episodesRef, orderBy('date', 'desc'));

  onSnapshot(q, (snapshot) => {
    setState({
      episodes: snapshot.docs,
    });
  });

  return (
    <>
      {state.episodes.length > 0 ? (
        state.episodes.map((doc) => (
          <Item
            key={doc.id}
            episodeId={doc.id}
            podcastId={podcastId}
            item={doc.data()}
          />
        ))
      ) : (
        <Typography align="center">
          {t('Episodes.no-episodes.text')}{' '}
          <Link href={`episodes/new`}>{t('Episodes.no-episodes.link')}</Link>
        </Typography>
      )}
    </>
  );
};

export default Episodes;
