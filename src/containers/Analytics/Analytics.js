import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { httpsCallable } from 'firebase/functions';
import withAuth from '../../helpers/WithAuth';
import { functions, auth } from '../../helpers/Firebase';
import BarChart from './components/BarChart';
import { Container, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Analytics = () => {
  const [data, setData] = useState([]);
  const [t] = useTranslation();
  const { podcastId } = useParams();

  useEffect(() => {
    const getData = async () => {
      const getTotalDownloads = httpsCallable(
        functions,
        'analytics-totalDownloads',
      );

      getTotalDownloads({
        podcastId,
      })
        .then(({ data }) => {
          setData(data.slice(0, 10));
        })
        .catch((e) => {
          console.error(e);
        });
    };
    getData();
  }, [podcastId]);

  return (
    <Container maxWidth="lg" sx={{ paddingY: 2 }}>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          {t('Analytics.title')}
        </Typography>
        <BarChart data={data} />
      </Paper>
    </Container>
  );
};

export default withAuth(Analytics);
