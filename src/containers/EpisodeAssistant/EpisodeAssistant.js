import { Box, Button } from '@mui/material';
import { httpsCallable } from 'firebase/functions';
import { ref, getBlob } from 'firebase/storage';
import { useState, useEffect } from 'react';
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
  const [autoRefetch, setAutoRefetch] = useState(true);

  const transcribeAudio = httpsCallable(
    functions,
    'transcribeAudioFile-uiEndpoint',
  );

  const query = useEpisodeQuery(
    {
      podcastId,
      episodeId,
    },
    {
      refetchInterval: autoRefetch ? 1000 : false,
    },
  );

  useEffect(() => {
    if (query.data) {
      const transcript = query.data?.data()?.transcript;
      switch (transcript?.status) {
        case 'done':
          const pathReference = ref(storage, transcript.gcsUri);
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
          break;
        case 'processing':
          // Do nothing
          break;
        default:
          setAutoRefetch(false);
          setIsLoading(false);
      }
    }
  }, [query.data]);

  return (
    <PageContainer title={t('EpisodeAssistant.title')}>
      <LoadingWrapper
        isLoading={isLoading}
        isSuccess={!isLoading}
        isError={query.isError}
      >
        <Box>
          {transcript || (
            <Button
              onClick={async () => {
                await transcribeAudio({ podcastId, episodeId });

                setIsLoading(true);
                setAutoRefetch(true);
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
