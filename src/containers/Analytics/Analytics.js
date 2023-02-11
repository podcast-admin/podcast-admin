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

      try {
        setData(
          await getTotalDownloads({
            podcastId,
          }),
        );
      } catch (e) {
        console.error(e);
      }
    };
    getData();
  }, [podcastId]);

  const data2 = [
    {
      name: t('Analytics.month', {
        val: new Date(Date.UTC(2012, 11, 1, 0, 0, 0)),
        formatParams: {
          val: { year: 'numeric', month: 'short' },
        },
      }),
      pv: 2400,
    },
    {
      name: t('Analytics.month', {
        val: new Date(Date.UTC(2012, 12, 1, 0, 0, 0)),
        formatParams: {
          val: { year: 'numeric', month: 'short' },
        },
      }),
      pv: 1398,
    },
    {
      name: t('Analytics.month', {
        val: new Date(Date.UTC(2013, 1, 1, 0, 0, 0)),
        formatParams: {
          val: { year: 'numeric', month: 'short' },
        },
      }),
      pv: 9800,
    },
    {
      name: t('Analytics.month', {
        val: new Date(Date.UTC(2013, 2, 1, 0, 0, 0)),
        formatParams: {
          val: { year: 'numeric', month: 'short' },
        },
      }),
      pv: 3908,
    },
    {
      name: t('Analytics.month', {
        val: new Date(Date.UTC(2013, 3, 1, 0, 0, 0)),
        formatParams: {
          val: { year: 'numeric', month: 'short' },
        },
      }),
      pv: 4800,
      amt: 2181,
    },
    {
      name: t('Analytics.month', {
        val: new Date(Date.UTC(2013, 4, 1, 0, 0, 0)),
        formatParams: {
          val: { year: 'numeric', month: 'short' },
        },
      }),
      pv: 3800,
      amt: 2500,
    },
    {
      name: t('Analytics.month', {
        val: new Date(Date.UTC(2013, 5, 1, 0, 0, 0)),
        formatParams: {
          val: { year: 'numeric', month: 'short' },
        },
      }),
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ paddingY: 2 }}>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Some Title
        </Typography>
        <BarChart data={data} />
      </Paper>
    </Container>
  );
};

export default withAuth(Analytics);
