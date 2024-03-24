import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../helpers/Firebase';

const useEpisodeQuery = ({ podcastId, episodeId }, options = {}) => {
  return useQuery({
    queryKey: ['episode', podcastId, episodeId],
    queryFn: async () => {
      const episodeRef = doc(db, 'podcasts', podcastId, 'episodes', episodeId);
      return await getDoc(episodeRef);
    },
    refetchOnWindowFocus: false,
    ...options,
  });
};

export default useEpisodeQuery;
