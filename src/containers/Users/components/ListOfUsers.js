import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { httpsCallable } from 'firebase/functions';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { functions } from '../../../helpers/Firebase';

const ListOfUsers = () => {
  const [t] = useTranslation();
  const [users, setUsers] = useState([]);
  const { podcastId } = useParams();
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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>&nbsp;</TableCell>
            <TableCell>{t('UsersOverview.displayName')}</TableCell>
            <TableCell>{t('UsersOverview.email')}</TableCell>
            <TableCell>{t('UsersOverview.creationTime')}</TableCell>
            <TableCell>{t('UsersOverview.lastSignInTime')}</TableCell>
            <TableCell>{t('UsersOverview.providerIds')}</TableCell>
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
                  {t('UsersOverview.intlDateTime', {
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
                  {t('UsersOverview.intlDateTime', {
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
  );
};

export default ListOfUsers;
