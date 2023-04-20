import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../helpers/Firebase';

/**
 * Loads the current podcast data from Firestore.
 *
 * @param {String} podcastId
 * @param {Object} options
 * @returns {DocumentSnapshot}
 */

const usePodcastQuery = (podcastId, options = undefined) => {
  return useQuery({
    queryKey: ['episode', podcastId],
    queryFn: async (context) => {
      const episodeRef = doc(db, 'podcasts', podcastId);
      return await getDoc(episodeRef);
    },
    refetchOnWindowFocus: false,
    ...options,
  });
};

export default usePodcastQuery;
