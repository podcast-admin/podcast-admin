import React from 'react';
import { httpsCallable } from 'firebase/functions';
import withAuth from '../../helpers/WithAuth';
import { functions, auth } from '../../helpers/Firebase';
import BarChart from './components/BarChart';
import { Container, Paper, Typography } from '@mui/material';

const Analytics = () => {
  return (
    <Container maxWidth="lg" sx={{ paddingY: 2 }}>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Some Title
        </Typography>
        <BarChart />
      </Paper>
    </Container>
  );
};

export default withAuth(Analytics);
