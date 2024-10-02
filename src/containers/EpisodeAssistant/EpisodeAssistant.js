import {
  Box,
  Button,
  Typography,
  Grid2 as Grid,
  CircularProgress,
} from '@mui/material';
import { httpsCallable } from 'firebase/functions';
import { ref, getBlob } from 'firebase/storage';
import { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import LoadingWrapper from '../../components/LoadingWrapper';
import Markdown from '../../components/Markdown';
import PageContainer from '../../components/PageContainer/PageContainer';
import { storage, functions } from '../../helpers/Firebase';
import useEpisodeQuery from '../../hooks/useEpisodeQuery';
import useGenAiPromptMutation from '../../hooks/useGenAiPromptMutation';
import usePodcastQuery from '../../hooks/usePodcastQuery';

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

  const episodeQuery = useEpisodeQuery(
    {
      podcastId,
      episodeId,
    },
    {
      refetchInterval: autoRefetch ? 1000 : false,
    },
  );

  const podcastQuery = usePodcastQuery(podcastId);

  const genAiPromptMutation = useGenAiPromptMutation();

  useEffect(() => {
    if (episodeQuery.data) {
      const transcript = episodeQuery.data?.data()?.transcript;
      switch (transcript?.status) {
        case 'done':
          const pathReference = ref(storage, transcript.gcsUri);
          getBlob(pathReference).then((data) =>
            data.text().then((data) => {
              setTranscript(
                JSON.parse(data).results.map((result) =>
                  result.alternatives?.map(
                    (alternative) => alternative.transcript,
                  ),
                ),
              );
              setAutoRefetch(false);
              setIsLoading(false);
            }),
          );
          break;
        case 'processing':
          // Do nothing
          break;
        case 'error':
          setTranscript(transcript.errorMessage);
          setAutoRefetch(false);
          setIsLoading(false);
          break;
        default:
          setAutoRefetch(false);
          setIsLoading(false);
      }
    }
  }, [episodeQuery.data]);

  return (
    <PageContainer title={t('EpisodeAssistant.title')}>
      <Typography variant="h3" gutterBottom>
        {t('EpisodeAssistant.transcript.headline')}
      </Typography>
      <LoadingWrapper
        isLoading={isLoading}
        isSuccess={!isLoading}
        isError={episodeQuery.isError}
      >
        <Box>
          {transcript ? (
            <>
              <CopyToClipboard text={transcript}>
                <Button>Abschrift kopieren</Button>
              </CopyToClipboard>
              <Typography variant="h3" gutterBottom>
                Texte generieren
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  {podcastQuery.isSuccess &&
                    podcastQuery.data
                      ?.data()
                      .genAiPrompts.map(({ id, title, description }) => (
                        <>
                          <Grid size={4}>{title}</Grid>
                          <Grid size={6}>{description}</Grid>
                          <Grid size={2}>
                            <Button
                              disabled={genAiPromptMutation.isPending}
                              onClick={() => {
                                genAiPromptMutation.mutate({
                                  podcastId,
                                  episodeId,
                                  promptId: id,
                                });
                              }}
                            >
                              Ausführen
                            </Button>
                          </Grid>
                        </>
                      ))}
                </Grid>
              </Box>
              <>
                <Typography variant="h3" gutterBottom>
                  Ergebnis
                </Typography>
                {(() => {
                  switch (genAiPromptMutation.status) {
                    case 'success':
                      return (
                        <>
                          <Markdown text={genAiPromptMutation.data} />
                          <CopyToClipboard text={genAiPromptMutation.data}>
                            <Button>Ergebnis kopieren</Button>
                          </CopyToClipboard>
                        </>
                      );
                    case 'pending':
                      return <CircularProgress />;
                    default:
                  }
                })()}
              </>
            </>
          ) : (
            <>
              <Typography gutterBottom>
                {t('EpisodeAssistant.intro')}
              </Typography>
              <Button
                onClick={async () => {
                  setIsLoading(true);
                  await transcribeAudio({ podcastId, episodeId });
                  setAutoRefetch(true);
                }}
              >
                {t('EpisodeAssistant.button.transcribe')}
              </Button>
            </>
          )}
        </Box>
      </LoadingWrapper>
    </PageContainer>
  );
};

export default EpisodeAssistant;
