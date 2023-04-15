import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { startOfToday } from 'date-fns';
import Slugify from '../../helpers/Slugify';
import useIntroQuery from '../../hooks/useIntroQuery';
import useOutroQuery from '../../hooks/useOutroQuery';

import {
  Button,
  Box,
  Grid,
  OutlinedInput,
  Container,
  Stack,
  Paper,
  Typography,
  TextField,
  FormHelperText,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  LinearProgress,
  Link,
} from '@mui/material';
import PublishIcon from '@mui/icons-material/Publish';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

import {
  ref,
  uploadBytesResumable,
  getMetadata,
  getDownloadURL,
} from 'firebase/storage';

import { db, storage } from '../../helpers/Firebase';
import Dropzone from '../Dropzone';
import DeleteButton from '../DeleteButton';
import MarkdownEditor from '../MarkdownEditor';

const Upload = (props) => {
  const params = useParams();

  const { episodeId } = props;
  const podcastId = props.podcastId || params.podcastId;
  const episodeCollection = collection(db, 'podcasts', podcastId, 'episodes');
  const [firestoreDoc, setFirestoreDoc] = useState(
    episodeId ? doc(episodeCollection, episodeId) : doc(episodeCollection),
  );
  const [isSaved, setIsSaved] = useState(episodeId ? true : false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadWasSuccessful, setUploadWasSuccessful] = useState();

  const [t] = useTranslation();
  const [file, setFile] = useState();
  const [episode, setEpisode] = useState({
    title: '',
    date: startOfToday(),
    subtitle: '',
    description: '',
    type: '',
    intro: '',
    outro: 'default',
    audio_original: '',
    length: 0,
    image: '',
  });

  const { isSuccess: isIntrosSuccess, data: intros } = useIntroQuery(podcastId);

  const { isSuccess: isOutrosSuccess, data: outros } = useOutroQuery(podcastId);

  const saveEpisode = useCallback(async () => {
    await setDoc(firestoreDoc, episode, { merge: true });
    setIsSaved(true);
  }, [firestoreDoc, episode]);

  const handleButtonSaveClick = async () => {
    await saveEpisode();
    window.location.href = '/';
  };

  const handleFormChange = (event) => {
    let data = {};
    data[event.target.name] = event.target.value;
    handleEpisodeDataChange(data);
  };

  const handleDescriptionChange = (value) => {
    handleEpisodeDataChange({ description: value });
  };

  /**
   * Takes object and merges it with the current episode object.
   * @param {object} data
   */
  const handleEpisodeDataChange = (data) => {
    setEpisode({
      ...episode,
      ...data,
    });
  };

  const handleDocIdBlur = (event) => {
    const slugified_id = Slugify(event.target.value);

    setFirestoreDoc(
      slugified_id.length > 0
        ? doc(episodeCollection, slugified_id)
        : doc(episodeCollection),
    );

    event.target.value = slugified_id;
  };

  const handleDateChange = (date) => {
    date.setHours(0, 0, 0, 0);
    handleEpisodeDataChange({ date });
  };

  useEffect(() => {
    if (episodeId) {
      const loadEpisode = async () => {
        const snapshot = await getDoc(firestoreDoc);
        const episodeObject = snapshot.data();
        episodeObject.date = snapshot.data().date.toDate();
        handleEpisodeDataChange(episodeObject);
      };
      loadEpisode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeId]);

  useEffect(() => {
    if (!file) {
      return;
    }

    const getFileEnding = () => {
      const parts = file.name.split('.');
      return parts.pop();
    };

    const uploadFiles = () => {
      const storageRef = ref(storage, `podcasts/${podcastId}/episodes`);

      setIsUploading(true);
      setUploadProgress(0);

      let uploadFileName = '';
      if (file.type.includes('image')) {
        uploadFileName = `${firestoreDoc.id}.${getFileEnding()}`;
      } else if (file.type.includes('audio')) {
        uploadFileName = `original-audio-${Date.now()}.${getFileEnding()}`;
      } else {
        uploadFileName = file.name;
      }

      const fileRef = ref(storageRef, `${firestoreDoc.id}/${uploadFileName}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          setUploadProgress(snapshot.bytesTransferred / snapshot.totalBytes);
        },
        (error) => {
          // Handle unsuccessful uploads
          setIsUploading(false);
          setUploadWasSuccessful(false);
        },
        async () => {
          setIsUploading(false);
          setUploadWasSuccessful(true);

          const metadata = await getMetadata(fileRef);

          if (metadata.contentType.includes('image')) {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            handleEpisodeDataChange({ image: downloadURL });
          } else if (metadata.contentType.includes('audio')) {
            handleEpisodeDataChange({
              audio_original: fileRef.fullPath,
              length: uploadTask.snapshot.totalBytes,
            });
          }
        },
      );
    };
    uploadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    if (isUploading || !uploadWasSuccessful) {
      return;
    }

    saveEpisode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploading, uploadWasSuccessful]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: 4,
      }}
    >
      <Paper sx={{ padding: 2 }}>
        <Box
          component="form"
          sx={{
            width: '100%',
          }}
          noValidate
          autoComplete="off"
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                {episode.title || t('Upload.defaultTitle')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Dropzone
                onFilesAdded={(files) => {
                  setFile(files[0]);
                }}
                disabled={isUploading}
                icon={<PublishIcon />}
                label={t('Upload.dropZone.label')}
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <Stack>
                <Typography className="Filename">{file?.name}</Typography>
                {isUploading || uploadWasSuccessful ? (
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress * 100}
                    color={uploadWasSuccessful ? 'success' : 'inherit'}
                  />
                ) : null}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="id">{t('Upload.form.id')}</InputLabel>
                <OutlinedInput
                  id="id"
                  name="id"
                  onBlur={handleDocIdBlur}
                  defaultValue={firestoreDoc.id}
                  aria-describedby="id-helper-text"
                  disabled={isSaved}
                />
                <FormHelperText id="id-helper-text">
                  {t('Upload.form.id.helper-text.text')}&nbsp;
                  <Link
                    href="https://blog.hubspot.com/website/what-is-wordpress-slug"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {t('Upload.form.id.helper-text.more')}
                  </Link>
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t('Upload.form.date')}
                  value={episode.date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth required>
                <InputLabel id="type">{t('Upload.form.type')}</InputLabel>
                <Select
                  labelId="type"
                  id="type"
                  value={episode.type}
                  name="type"
                  onChange={handleFormChange}
                >
                  <MenuItem value="full">
                    {t('Upload.form.type.episode')}
                  </MenuItem>
                  <MenuItem value="trailer">
                    {t('Upload.form.type.trailer')}
                  </MenuItem>
                  <MenuItem value="bonus">
                    {t('Upload.form.type.bonus')}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="intro">{t('Upload.form.intro')}</InputLabel>
                <Select
                  labelId="intro"
                  id="intro"
                  value={episode.intro}
                  name="intro"
                  onChange={handleFormChange}
                >
                  <MenuItem value="">{t('Upload.form.intro.empty')}</MenuItem>
                  {isIntrosSuccess &&
                    Object.entries(intros).map(([key]) => (
                      <MenuItem value={key} key={key}>
                        {key}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="outro">{t('Upload.form.outro')}</InputLabel>
                <Select
                  labelId="outro"
                  id="outro"
                  value={episode.outro}
                  name="outro"
                  onChange={handleFormChange}
                >
                  <MenuItem value="">{t('Upload.form.outro.empty')}</MenuItem>
                  {isOutrosSuccess &&
                    Object.entries(outros).map(([key]) => (
                      <MenuItem value={key} key={key}>
                        {key}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label={t('Upload.form.title')}
                name="title"
                onChange={handleFormChange}
                value={episode.title}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label={t('Upload.form.subtitle')}
                name="subtitle"
                onChange={handleFormChange}
                value={episode.subtitle}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <MarkdownEditor
                  id="description"
                  name="description"
                  value={episode.description}
                  height={500}
                  onChange={handleDescriptionChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={2}
              >
                <DeleteButton
                  disabled={!isSaved}
                  doc={firestoreDoc}
                  redirectTo="/"
                />
                <Button
                  onClick={handleButtonSaveClick}
                  variant="contained"
                  color="primary"
                >
                  {t('Upload.form.save')}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Upload;
