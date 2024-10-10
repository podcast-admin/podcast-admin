import { useMutation } from '@tanstack/react-query';
import { httpsCallable } from 'firebase/functions';

import { functions } from '../helpers/Firebase';
/**
 * mutation.mutate({
 *   podcastId,
 *   episodeId,
 *   promptId: id,
 * });
 */
const useGenAiPromptMutation = () =>
  useMutation({
    mutationFn: async (variables) => {
      const runPrompt = httpsCallable(functions, 'genai-runEpisodePrompt');
      const { data } = await runPrompt(variables);
      return data;
    },
  });

export default useGenAiPromptMutation;
