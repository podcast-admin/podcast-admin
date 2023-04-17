import { useQuery } from '@tanstack/react-query';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../helpers/Firebase';
import hoursToMilliseconds from 'date-fns/hoursToMilliseconds';

const useTotalDownloadsQuery = (podcastId, options = undefined) => {
  return useQuery({
    queryKey: ['totalDownloads', podcastId],
    queryFn: async (context) => {
      const getTotalDownloads = httpsCallable(
        functions,
        'analytics-totalDownloads',
      );

      const result = await getTotalDownloads({ podcastId });
      return result.data;
    },
    refetchOnWindowFocus: false,
    staleTime: hoursToMilliseconds(12),
    ...options,
  });
};

export default useTotalDownloadsQuery;
