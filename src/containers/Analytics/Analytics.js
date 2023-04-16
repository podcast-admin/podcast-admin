import { useParams } from 'react-router-dom';
import withAuth from '../../helpers/WithAuth';
import useTotalDownloadsQuery from '../../hooks/useTotalDownloadsQuery';
import BarChart from './components/BarChart';
import { Container, Paper, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Analytics = () => {
  const [t] = useTranslation();
  const { podcastId } = useParams();
  const { data, isLoading, isSuccess } = useTotalDownloadsQuery(podcastId);

  return (
    <Container maxWidth="lg" sx={{ paddingY: 2 }}>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          {t('Analytics.title')}
        </Typography>
        {isLoading && <CircularProgress />}
        {isSuccess && <BarChart data={data.slice(0, 10)} />}
      </Paper>
    </Container>
  );
};

export default withAuth(Analytics);
