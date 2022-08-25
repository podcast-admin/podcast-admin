import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Link,
} from '@mui/material';
import { db } from '../../../helpers/Firebase';

const ListOfInvites = () => {
  const [t] = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [invites, setInvites] = useState([]);
  const { podcastId } = useParams();

  useEffect(() => {
    const getInvites = async () => {
      getDoc(doc(db, `podcasts/${podcastId}`))
        .then((result) => {
          setInvites(result.data().invitedAdmins || []);
          setIsLoading(false);
        })
        .catch((e) => {
          // TODO: Handle error
        });
    };

    getInvites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTableBody = () => {
    if (isLoading) {
      return renderCircularProgress();
    } else if (invites.length > 0) {
      return renderHasInvites();
    } else {
      return renderNoInvites();
    }
  };

  const renderCircularProgress = () => {
    return (
      <TableRow>
        <TableCell align="center" colSpan={7}>
          <CircularProgress />
        </TableCell>
      </TableRow>
    );
  };

  const renderHasInvites = () => {
    return invites.map((invite) => (
      <TableRow
        key={invite.email}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell>{invite.email}</TableCell>
        <TableCell>
          {t('ListOfInvites.intlDateTime', {
            val: Date.parse(invite.createdAt.toDate()),
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
      </TableRow>
    ));
  };

  const renderNoInvites = () => {
    return (
      <TableRow>
        <TableCell align="center" colSpan={7}>
          {t('ListOfInvites.noInvites.text')}{' '}
          <Link href="users/invite">{t('ListOfInvites.noInvites.link')}</Link>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{t('ListOfInvites.email')}</TableCell>
            <TableCell>{t('ListOfInvites.createdAt')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableBody()}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListOfInvites;
