import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../helpers/Firebase';

import {
  Container,
  Stack,
  Button,
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

const UsersList = () => {
  const [t] = useTranslation();
  const { podcastId } = useParams();
  const [users, setUsers] = useState([]);
  const usersList = httpsCallable(functions, 'users-list');

  useEffect(() => {
    const getUsers = async () => {
      usersList({ podcastId })
        .then((result) => {
          setUsers(result.data);
        })
        .catch((e) => {
          // TODO: Handle error
        });
    };

    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: 2,
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h3" gutterBottom>
          {t('UsersList.title')}
        </Typography>
        <Button href="users/invite">{t('UsersList.inviteButtonLabel')}</Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>&nbsp;</TableCell>
              <TableCell>{t('UsersList.displayName')}</TableCell>
              <TableCell>{t('UsersList.email')}</TableCell>
              <TableCell>{t('UsersList.creationTime')}</TableCell>
              <TableCell>{t('UsersList.lastSignInTime')}</TableCell>
              <TableCell>{t('UsersList.providerIds')}</TableCell>
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  key={user.displayName}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ width: '40px' }}>
                    <Avatar src={user.photoURL} />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {user.displayName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {t('UsersList.intlDateTime', {
                      val: Date.parse(user.creationTime),
                      formatParams: {
                        val: {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        },
                      },
                    })}
                  </TableCell>
                  <TableCell>
                    {t('UsersList.intlDateTime', {
                      val: Date.parse(user.lastSignInTime),
                      formatParams: {
                        val: {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        },
                      },
                    })}
                  </TableCell>
                  <TableCell>{user.providerIds.join(', ')}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={7}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UsersList;
