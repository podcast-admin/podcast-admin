import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Slugify from '../../helpers/Slugify';

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
import withRouter from '../../helpers/WithRouter';
import withAuth from '../../helpers/WithAuth';

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

class Upload extends Component {
  constructor(props) {
    super(props);

    const podcastId = this.props.podcastId || this.props.params.podcastId;

    this.storageRef = ref(storage, `podcasts/${podcastId}/episodes`);

    const { episodeId } = this.props;

    this.episodeCollection = collection(db, 'podcasts', podcastId, 'episodes');

    const beginningOfToday = new Date();
    beginningOfToday.setHours(0, 0, 0);

    this.state = {
      file: {},
      uploading: false,
      uploadProgress: 0,
      successfullUploaded: false,
      wasCreated: false,
      doc: episodeId
        ? doc(this.episodeCollection, episodeId)
        : doc(this.episodeCollection),
      episode: {
        title: '',
        date: beginningOfToday,
        subtitle: '',
        description: '',
        type: '',
        intro: '',
        outro: 'default',
        audio_original: '',
        length: 0,
        image: '',
      },
    };

    this.handleFilesAdded = this.handleFilesAdded.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleDocIdBlur = this.handleDocIdBlur.bind(this);
    this.onEpisodeDataChange = this.onEpisodeDataChange.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.saveEpisode = this.saveEpisode.bind(this);
    this.handleButtonSaveClick = this.handleButtonSaveClick.bind(this);
    this.loadEpisode = this.loadEpisode.bind(this);
    this.t = this.props.t;

    if (episodeId) {
      this.loadEpisode();
      this.state.wasCreated = true;
    }
  }

  handleFilesAdded(files) {
    this.setState(
      (prevState) => ({
        file: files[0],
      }),
      () => {
        this.uploadFiles();
      },
    );
  }

  uploadFiles() {
    this.setState({ uploadProgress: 0, uploading: true });

    let uploadFileName = '';
    if (this.state.file.type.includes('image')) {
      uploadFileName = `${this.state.doc.id}.${this.getFileEnding()}`;
    } else if (this.state.file.type.includes('audio')) {
      uploadFileName = `original-audio-${Date.now()}.${this.getFileEnding()}`;
    } else {
      uploadFileName = this.state.file.name;
    }

    const fileRef = ref(
      this.storageRef,
      `${this.state.doc.id}/${uploadFileName}`,
    );
    const uploadTask = uploadBytesResumable(fileRef, this.state.file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        this.setState({
          uploadProgress:
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        });
      },
      (error) => {
        // Handle unsuccessful uploads
        this.setState({ successfullUploaded: true, uploading: false });
      },
      async () => {
        this.setState({ successfullUploaded: true, uploading: false });

        const metadata = await getMetadata(fileRef);

        if (metadata.contentType.includes('image')) {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          this.onEpisodeDataChange('image', downloadURL);
        } else if (metadata.contentType.includes('audio')) {
          this.onEpisodeDataChange('audio_original', fileRef.fullPath);
          this.onEpisodeDataChange('length', uploadTask.snapshot.totalBytes);
        }

        this.saveEpisode();
      },
    );
  }

  getFileEnding() {
    const parts = this.state.file.name.split('.');
    return parts.pop();
  }

  async saveEpisode() {
    await setDoc(this.state.doc, this.state.episode, { merge: true });
    this.setState({ wasCreated: true });
  }

  async handleButtonSaveClick() {
    await this.saveEpisode();
    window.location.href = '/';
  }

  async loadEpisode() {
    const snapshot = await getDoc(this.state.doc);
    const episodeObject = snapshot.data();
    episodeObject.date = snapshot.data().date.toDate();
    this.setState({
      episode: episodeObject,
    });
  }

  handleFormChange(event) {
    this.onEpisodeDataChange(event.target.name, event.target.value);
  }

  onEpisodeDataChange(key, value) {
    this.setState((prevState) => ({
      episode: { ...prevState.episode, [key]: value },
    }));
  }

  handleDocIdBlur(event) {
    const slugified_id = Slugify(event.target.value);

    this.setState({
      doc:
        slugified_id.length > 0
          ? doc(this.episodeCollection, slugified_id)
          : doc(this.episodeCollection),
    });

    event.target.value = slugified_id;
  }

  renderProgress(file) {
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <LinearProgress
            variant="determinate"
            value={this.state.uploadProgress}
          />
        </div>
      );
    }
  }

  render() {
    const handleDateChange = (date) => {
      date.setHours(0, 0, 0, 0);
      this.onEpisodeDataChange('date', date);
    };

    return (
      <Container
        maxWidth="lg"
        sx={{
          padding: 4,
        }}
      >
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h5" gutterBottom>
            {this.state.episode.title || this.t('Upload.defaultTitle')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              paddingTop: 2,
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            <Box>
              <Dropzone
                onFilesAdded={this.handleFilesAdded}
                disabled={this.state.uploading}
              >
                <PublishIcon />
                <span>{this.t('Upload.dropZone.label')}</span>
              </Dropzone>
            </Box>
            <Box
              sx={{
                marginLeft: 4,
                alignItems: 'flex-start',
                justifyItems: 'flex-start',
                flex: 1,
                overflowY: 'auto',
              }}
            >
              <span className="Filename">{this.state.file.name}</span>
              {this.renderProgress(this.state.file)}
            </Box>
          </Box>
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
                <FormControl fullWidth required>
                  <InputLabel htmlFor="id">
                    {this.t('Upload.form.id')}
                  </InputLabel>
                  <OutlinedInput
                    id="id"
                    name="id"
                    onBlur={this.handleDocIdBlur}
                    defaultValue={this.state.doc.id}
                    aria-describedby="id-helper-text"
                    disabled={this.state.wasCreated}
                  />
                  <FormHelperText id="id-helper-text">
                    {this.t('Upload.form.id.helper-text.text')}&nbsp;
                    <Link
                      href="https://blog.hubspot.com/website/what-is-wordpress-slug"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {this.t('Upload.form.id.helper-text.more')}
                    </Link>
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={this.t('Upload.form.date')}
                    value={this.state.episode.date}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth required>
                  <InputLabel id="type">
                    {this.t('Upload.form.type')}
                  </InputLabel>
                  <Select
                    labelId="type"
                    id="type"
                    value={this.state.episode.type}
                    name="type"
                    onChange={this.handleFormChange}
                  >
                    <MenuItem value="full">
                      {this.t('Upload.form.type.episode')}
                    </MenuItem>
                    <MenuItem value="trailer">
                      {this.t('Upload.form.type.trailer')}
                    </MenuItem>
                    <MenuItem value="bonus">
                      {this.t('Upload.form.type.bonus')}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel id="intro">
                    {this.t('Upload.form.intro')}
                  </InputLabel>
                  <Select
                    labelId="intro"
                    id="intro"
                    value={this.state.episode.intro}
                    name="intro"
                    onChange={this.handleFormChange}
                  >
                    <MenuItem value="">
                      {this.t('Upload.form.intro.empty')}
                    </MenuItem>
                    <MenuItem value="main">
                      {this.t('Upload.form.intro.main')}
                    </MenuItem>
                    <MenuItem value="expert">
                      {this.t('Upload.form.intro.expert')}
                    </MenuItem>
                    <MenuItem value="sponsored">
                      {this.t('Upload.form.intro.sponsored')}
                    </MenuItem>
                    <MenuItem value="monologue">
                      {this.t('Upload.form.intro.monologue')}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel id="outro">
                    {this.t('Upload.form.outro')}
                  </InputLabel>
                  <Select
                    labelId="outro"
                    id="outro"
                    value={this.state.episode.outro}
                    name="outro"
                    onChange={this.handleFormChange}
                  >
                    <MenuItem value="">
                      {this.t('Upload.form.outro.empty')}
                    </MenuItem>
                    <MenuItem value="default">
                      {this.t('Upload.form.outro.default')}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label={this.t('Upload.form.title')}
                  name="title"
                  onChange={this.handleFormChange}
                  value={this.state.episode.title}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label={this.t('Upload.form.subtitle')}
                  name="subtitle"
                  onChange={this.handleFormChange}
                  value={this.state.episode.subtitle}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel htmlFor="description">
                    {this.t('Upload.form.description')}
                  </InputLabel>
                  <OutlinedInput
                    id="description"
                    name="description"
                    onChange={this.handleFormChange}
                    value={this.state.episode.description}
                    multiline
                    aria-describedby="description-helper-text"
                  />
                  <FormHelperText id="description-helper-text">
                    <Link
                      href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {this.t('Upload.form.description.helper-text')}
                    </Link>
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
          >
            <DeleteButton
              disabled={!this.state.wasCreated}
              doc={this.state.doc}
              redirectTo="/"
            />
            <Button
              onClick={this.handleButtonSaveClick}
              variant="contained"
              color="primary"
            >
              {this.t('Upload.form.save')}
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }
}

export default withTranslation()(withRouter(withAuth(Upload)));
