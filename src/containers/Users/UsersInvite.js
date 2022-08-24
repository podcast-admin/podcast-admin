import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  CircularProgress,
} from '@mui/material';

const UsersInvite = () => {
  const [t] = useTranslation();

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: 2,
      }}
    >
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h3" gutterBottom>
          {t('UsersList.title')}
        </Typography>
      </Paper>
    </Container>
  );
};

export default UsersInvite;
