import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Slugify from 'slugify';
import {
  Button,
  Container,
  Paper,
  Typography,
  TextField,
  Box,
  Link,
  Grid,
  FormControl,
  OutlinedInput,
  InputLabel,
  FormHelperText,
  Snackbar,
  IconButton,
} from '@mui/material';

import withStyles from '@mui/styles/withStyles';
import CloseIcon from '@mui/icons-material/Close';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../helpers/Firebase';

const styles = (theme) => ({
  root: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    textAlign: 'left',
    overflow: 'hidden',

    width: '100%',
    margin: `${theme.spacing(3)} auto`,
    padding: theme.spacing(4),

    display: 'flex',
  },

  saveButton: {
    marginLeft: '-8px',
    marginTop: '16px',
  },
});

class PodcastForm extends Component {
  constructor(props) {
    super(props);

    const { podcastId } = this.props;

    this.podcastCollection = collection(db, 'podcasts');

    this.state = {
      successMessageVisible: false,
      doc: podcastId
        ? doc(this.podcastCollection, podcastId)
        : doc(this.podcastCollection),
      podcastSaved: false,
      podcast: {
        admins: [auth.currentUser.uid],
        name: '',
        email: '',
        website: '',
        language: '',
        explicit: '',
        copyright: '',
        category: '',
        author: '',
        image: '',
        subtitle: '',
        description: '',
        footer: '',
      },
    };

    this.handleCloseSuccessMessage = this.handleCloseSuccessMessage.bind(this);
    this.handleSavePodcast = this.handleSavePodcast.bind(this);
    this.loadPodcast = this.loadPodcast.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleDocIdBlur = this.handleDocIdBlur.bind(this);

    this.loadPodcast();

    this.t = this.props.t;
  }

  handleCloseSuccessMessage = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ successMessageVisible: false });
  };

  async handleSavePodcast() {
    await setDoc(this.state.doc, this.state.podcast);
    this.setState({ successMessageVisible: true, podcastSaved: true });

    if (this.props.onSave) {
      this.props.onSave();
    }
  }

  async loadPodcast() {
    const snapshot = await getDoc(this.state.doc);
    if (snapshot.data()) {
      this.setState({
        podcast: snapshot.data(),
        podcastSaved: true,
      });
    }
  }

  handleFormChange(event) {
    this.handleDataChange(event.target.name, event.target.value);
  }

  handleDataChange(key, value) {
    this.setState((prevState) => ({
      podcast: { ...prevState.podcast, [key]: value },
    }));
  }

  handleDocIdBlur(event) {
    const slugified_id = Slugify(event.target.value, { lower: true });
    this.setState({
      doc:
        slugified_id.length > 0
          ? doc(this.podcastCollection, slugified_id)
          : doc(this.podcastCollection),
    });

    event.target.value = slugified_id;
  }

  render() {
    const { classes } = this.props;

    return (
      <Container maxWidth="lg" sx={{ paddingY: 2 }}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            {this.state.podcast.name || this.t('PodcastForm.name.default')}
          </Typography>
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
                <TextField
                  required
                  label={this.t('PodcastForm.id')}
                  name="id"
                  onBlur={this.handleDocIdBlur}
                  disabled={this.state.podcastSaved}
                  defaultValue={this.state.doc.id}
                  helperText={this.t('PodcastForm.id.helper-text')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  label={this.t('PodcastForm.name')}
                  name="name"
                  onChange={this.handleFormChange}
                  value={this.state.podcast.name}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  label={this.t('PodcastForm.subtitle')}
                  name="subtitle"
                  onChange={this.handleFormChange}
                  value={this.state.podcast.subtitle}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  required
                  label={this.t('PodcastForm.author')}
                  name="author"
                  onChange={this.handleFormChange}
                  value={this.state.podcast.author}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  required
                  label={this.t('PodcastForm.copyright')}
                  name="copyright"
                  onChange={this.handleFormChange}
                  value={this.state.podcast.copyright}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  required
                  label={this.t('PodcastForm.email')}
                  name="email"
                  onChange={this.handleFormChange}
                  value={this.state.podcast.email}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  required
                  label={this.t('PodcastForm.website')}
                  name="website"
                  onChange={this.handleFormChange}
                  value={this.state.podcast.website}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  label={this.t('PodcastForm.image')}
                  name="image"
                  onChange={this.handleFormChange}
                  value={this.state.podcast.image}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  required
                  label={this.t('PodcastForm.category')}
                  name="category"
                  onChange={this.handleFormChange}
                  value={this.state.podcast.category}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  required
                  label={this.t('PodcastForm.explicit')}
                  name="explicit"
                  onChange={this.handleFormChange}
                  value={this.state.podcast.explicit}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  required
                  label={this.t('PodcastForm.language')}
                  name="language"
                  onChange={this.handleFormChange}
                  value={this.state.podcast.language}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  label={this.t('PodcastForm.description')}
                  name="description"
                  onChange={this.handleFormChange}
                  value={this.state.podcast.description}
                  fullWidth
                  multiline
                  minRows={10}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel htmlFor="footer">
                    {this.t('PodcastForm.footer')}
                  </InputLabel>
                  <OutlinedInput
                    id="footer"
                    name="footer"
                    onChange={this.handleFormChange}
                    value={this.state.podcast.footer}
                    multiline
                    aria-describedby="component-helper-text"
                    minRows={10}
                  />
                  <FormHelperText id="component-helper-text">
                    {this.t('PodcastForm.footer.helper-text')}{' '}
                    <Link
                      href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {this.t('PodcastForm.footer.helper-link')}
                    </Link>
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid container item xs={12} justifyContent="flex-end">
                <Button
                  className={classes.saveButton}
                  onClick={this.handleSavePodcast}
                  color="primary"
                >
                  {this.t('PodcastForm.save')}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.successMessageVisible}
            autoHideDuration={6000}
            onClose={this.handleCloseSuccessMessage}
            message={this.t('PodcastForm.save.success-message')}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleCloseSuccessMessage}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </Paper>
      </Container>
    );
  }
}

export default withTranslation()(withStyles(styles)(PodcastForm));
