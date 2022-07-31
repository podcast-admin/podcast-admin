import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import withAuth from '../../helpers/WithAuth';

import { Container, Typography, Grid, Paper } from '@mui/material';

import Dropzone from '../../components/Dropzone';

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, storage } from '../../helpers/Firebase';
import { ref, uploadBytesResumable } from 'firebase/storage';

const ListIntroOutro = () => {
  const { podcastId } = useParams();
  const [t] = useTranslation();
  const [intros, setIntros] = useState([]);
  const [outros, setOutros] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [episodeProcessingStates, setEpisodeProcessingStates] = useState([]);

  const episodeCollection = collection(db, 'podcasts', podcastId, 'episodes');

  useEffect(() => {
    const fetchData = async () => {
      const introsSnap = await getDoc(doc(db, 'podcasts', podcastId));
      setIntros(Object.entries(introsSnap.data().intro));
      setOutros(Object.entries(introsSnap.data().outro));
    };
    fetchData();

    const unsubscribe = onSnapshot(
      query(episodeCollection, where('processing', '==', 'restart')),
      (querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, processing: doc.data().processing });
        });
        setEpisodeProcessingStates(docs);
      },
    );

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderDropzones = (array, type) => {
    return (
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Grid container spacing={2}>
          {array.map(([label, value]) => {
            return (
              <Grid item xs={6} key={value}>
                <Dropzone
                  onFilesAdded={(files) => uploadFiles(files, type, label)}
                  accept=".mp3"
                >
                  <Typography variant="h6">{label}</Typography>
                  <Typography variant="subtitle1">{value}</Typography>
                  {isUploading && (
                    <Typography variant="subtitle1">
                      {uploadProgress}
                    </Typography>
                  )}
                </Dropzone>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    );
  };

  const uploadFiles = (files, type, label) => {
    if (files.length > 1) {
      return;
    }

    const file = files[0];

    setIsUploading(true);
    setUploadProgress(0);

    const uploadFileName = `${type}-${label}.mp3`;

    const uploadRef = ref(storage, `podcasts/${podcastId}/${uploadFileName}`);

    const uploadTask = uploadBytesResumable(uploadRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        setUploadProgress(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
      },
      (error) => {
        // Handle unsuccessful uploads
        setIsUploading(false);
      },
      async () => {
        setIsUploading(false);
        await reprocessEpisodes(type, label);
      },
    );
  };

  const reprocessEpisodes = async (type, label) => {
    const querySnapshot = await getDocs(
      query(episodeCollection, where(type, '==', label)),
    );

    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, { processing: 'restart' });
    });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: 4,
      }}
    >
      <Typography variant="h3" gutterBottom>
        {t('ListIntroOutro.title')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h5" gutterBottom>
            {t('ListIntroOutro.intros')}
          </Typography>
          {renderDropzones(intros, 'intro')}
          <Typography variant="h5" gutterBottom>
            {t('ListIntroOutro.outros')}
          </Typography>
          {renderDropzones(outros, 'outro')}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" gutterBottom>
            {t('ListIntroOutro.processing-changes')}
          </Typography>
          <Paper sx={{ padding: 2, marginBottom: 2 }}>
            {episodeProcessingStates.length > 0 ? (
              episodeProcessingStates.map(({ id }) => (
                <Typography variant="body1" key={id}>
                  <Trans
                    i18nKey="ListIntroOutro.creating-new-audio-file-for"
                    values={{ id }}
                  />
                </Typography>
              ))
            ) : (
              <Typography variant="body1">
                {t('ListIntroOutro.all-files-processed')}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default withAuth(ListIntroOutro);
