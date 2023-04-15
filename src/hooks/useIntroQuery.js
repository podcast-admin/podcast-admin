import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../helpers/Firebase';

const useIntroQuery = (podcastId, options = undefined) => {
  return useQuery({
    queryKey: ['intros', podcastId],
    queryFn: async (context) => {
      const podcastRef = doc(db, 'podcasts', podcastId);
      const podcast = await getDoc(podcastRef);
      return podcast.data().intro;
    },
    refetchOnWindowFocus: false,
    ...options,
  });
};

export default useIntroQuery;
