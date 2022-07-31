import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../helpers/Firebase';

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
} from '@mui/material';

const Users = () => {
  const [t] = useTranslation();
  const { podcastId } = useParams();
  const [users, setUsers] = useState([]);
  const userList = httpsCallable(functions, 'users-list');

  useEffect(() => {
    const getUsers = async () => {
      userList({ podcastId })
        .then((result) => {
          setUsers(result.data);
        })
        .catch((e) => {
          // TODO: Handle error
        });
    };

    getUsers();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {t('Users.title')}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>&nbsp;</TableCell>
              <TableCell>{t('Users.displayName')}</TableCell>
              <TableCell>{t('Users.email')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.displayName}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Avatar src={user.photoURL} />
                </TableCell>
                <TableCell component="th" scope="row">
                  {user.displayName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Users;
