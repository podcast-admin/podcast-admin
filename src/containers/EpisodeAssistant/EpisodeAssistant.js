import { Box, Button } from '@mui/material';
import { httpsCallable } from 'firebase/functions';
import { ref, getBlob } from 'firebase/storage';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import LoadingWrapper from '../../components/LoadingWrapper';
import PageContainer from '../../components/PageContainer/PageContainer';
import { storage, functions } from '../../helpers/Firebase';
import useEpisodeQuery from '../../hooks/useEpisodeQuery';

const EpisodeAssistant = () => {
  const { podcastId, episodeId } = useParams();
  const [t] = useTranslation();
  const [transcript, setTranscript] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const transcribeAudio = httpsCallable(
    functions,
    'transcribeAudioFile-uiEndpoint',
  );

  const refetch = () =>
    setTimeout(() => {
      refetchQuery();
      isLoading && refetch();
    }, 1000);

  const { isError, refetch: refetchQuery } = useEpisodeQuery(
    {
      podcastId,
      episodeId,
    },
    {
      onSuccess: (data) => {
        const transcriptGcsUri = data?.data()?.transcript?.gcsUri;
        if (transcriptGcsUri) {
          const pathReference = ref(storage, transcriptGcsUri);
          getBlob(pathReference).then((data) =>
            data.text().then((data) => {
              setTranscript(
                JSON.parse(data).results.map((result) =>
                  result.alternatives.map(
                    (alternative) => alternative.transcript,
                  ),
                ),
              );
              setIsLoading(false);
            }),
          );
        } else {
          setIsLoading(false);
        }
      },
    },
  );

  return (
    <PageContainer title={t('EpisodeAssistant.title')}>
      <LoadingWrapper
        isLoading={isLoading}
        isSuccess={!isLoading}
        isError={isError}
      >
        <Box>
          {transcript || (
            <Button
              onClick={() => {
                transcribeAudio({ podcastId, episodeId });
                setIsLoading(true);
                refetch();
              }}
            >
              Transcibe
            </Button>
          )}
        </Box>
      </LoadingWrapper>
    </PageContainer>
  );
};

export default EpisodeAssistant;
