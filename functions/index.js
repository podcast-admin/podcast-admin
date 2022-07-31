const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const loadAnalytics = require('./load-analytics').loadFile;
const onPodcastUpdateCreate =
  require('./onPodcastUpdateCreate').onPodcastUpdateCreate;
const onEpisodeUpdateCreate = require('./onEpisodeUpdateCreate');
const onEpisodeDelete = require('./onEpisodeDelete');
const onPodcastDelete = require('./onPodcastDelete');

const longerTimeout = {
  timeoutSeconds: 540,
  memory: '512MB',
};

exports.feed = require('./podcastFeed');

exports.loadAnalytics = functions
  .region('us-central1')
  .storage.bucket('logs-bucket-podcast-admin')
  .object()
  .onFinalize(loadAnalytics);

exports.onPodcastDelete = functions
  .region('europe-west1')
  .firestore.document('podcasts/{podcastId}/episodes/{episodeId}')
  .onDelete(onPodcastDelete.onPodcastDelete);

exports.onPodcastUpdate = functions
  .region('europe-west1')
  .firestore.document('podcasts/{podcastId}')
  .onUpdate(onPodcastUpdateCreate);

exports.onPodcastCreate = functions
  .region('europe-west1')
  .firestore.document('podcasts/{podcastId}')
  .onCreate(onPodcastUpdateCreate);

exports.onEpisodeUpdate = functions
  .region('europe-west1')
  .runWith(longerTimeout)
  .firestore.document('podcasts/{podcastId}/episodes/{episodeId}')
  .onUpdate(onEpisodeUpdateCreate.onEpisodeUpdate);

exports.onEpisodeCreate = functions
  .region('europe-west1')
  .runWith(longerTimeout)
  .firestore.document('podcasts/{podcastId}/episodes/{episodeId}')
  .onCreate(onEpisodeUpdateCreate.onEpisodeCreate);

exports.onEpisodeDelete = functions
  .region('europe-west1')
  .firestore.document('podcasts/{podcastId}/episodes/{episodeId}')
  .onDelete(onEpisodeDelete);

exports.updateCustomClaims = require('./updateCustomClaims');
exports.setCustomClaims = require('./setCustomClaims');

exports.scheduledFirestoreExport = require('./firestoreBackups');
