const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp();
const { setGlobalOptions } = require('firebase-functions/v2');

const loadAnalytics = require('./load-analytics').loadFile;
const onEpisodeDelete = require('./onEpisodeDelete');
const onEpisodeUpdateCreate = require('./onEpisodeUpdateCreate');
const onPodcastDelete = require('./onPodcastDelete');
const onPodcastUpdateCreate =
  require('./onPodcastUpdateCreate').onPodcastUpdateCreate;

// locate all functions closest to users
setGlobalOptions({ region: 'europe-west3' });

exports.feed = require('./podcastFeed');

exports.loadAnalytics = functions
  .region('us-central1')
  .storage.bucket('logs-bucket-podcast-admin')
  .object()
  .onFinalize(loadAnalytics);

exports.onPodcastDelete = functions
  .region('europe-west3')
  .firestore.document('podcasts/{podcastId}/episodes/{episodeId}')
  .onDelete(onPodcastDelete.onPodcastDelete);

exports.onPodcastUpdate = functions
  .region('europe-west3')
  .firestore.document('podcasts/{podcastId}')
  .onUpdate(onPodcastUpdateCreate);

exports.onPodcastCreate = functions
  .region('europe-west3')
  .firestore.document('podcasts/{podcastId}')
  .onCreate(onPodcastUpdateCreate);

exports.onEpisodeUpdate = functions
  .region('europe-west3')
  .runWith({
    timeoutSeconds: 540,
    memory: '1GB',
  })
  .firestore.document('podcasts/{podcastId}/episodes/{episodeId}')
  .onUpdate(onEpisodeUpdateCreate.onEpisodeUpdate);

exports.onEpisodeCreate = functions
  .region('europe-west3')
  .runWith({
    timeoutSeconds: 540,
    memory: '1GB',
  })
  .firestore.document('podcasts/{podcastId}/episodes/{episodeId}')
  .onCreate(onEpisodeUpdateCreate.onEpisodeCreate);

exports.onEpisodeDelete = functions
  .region('europe-west3')
  .firestore.document('podcasts/{podcastId}/episodes/{episodeId}')
  .onDelete(onEpisodeDelete);

exports.updateCustomClaims = require('./updateCustomClaims');
exports.setCustomClaims = require('./setCustomClaims');

exports.scheduledFirestoreExport = require('./firestoreBackups');

exports.users = require('./users');
exports.resizeImage = require('./resizeImage');
exports.transcribeAudioFile = require('./lib/transcribeAudioFile');
exports.genai = require('./genai');
