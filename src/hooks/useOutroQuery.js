import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../helpers/Firebase';

const useOutroQuery = (podcastId, options = undefined) => {
  return useQuery({
    queryKey: ['outros', podcastId],
    queryFn: async (context) => {
      const podcastRef = doc(db, 'podcasts', podcastId);
      const podcast = await getDoc(podcastRef);
      return podcast.data().outro;
    },
    refetchOnWindowFocus: false,
    ...options,
  });
};

export default useOutroQuery;
