const { PubSub } = require('@google-cloud/pubsub');
const { SpeechClient } = require('@google-cloud/speech').v2;
const { getFirestore } = require('firebase-admin/firestore');
const {
  logger: { error, info },
  https: { HttpsError },
} = require('firebase-functions');
const { onCall } = require('firebase-functions/v2/https');
const { onMessagePublished } = require('firebase-functions/v2/pubsub');

const BUCKET = 'podcast-admin.appspot.com';
const PUBSUB_TOPIC = 'elearning-report';

const db = getFirestore();
const collectionRef = db.collection('podcasts');

// It doesn't work with some WAV files that were created with Garage Band.
const FILE =
  'podcasts/2T9aVqEJhvd1Fck2vVPp/episodes/8-prinzipien-zur-entwicklung-digitaler-services/original-audio-1687337093368.mp3';

const client = new SpeechClient({
  apiEndpoint: 'europe-west4-speech.googleapis.com',
});

/**
 *
 * @param {String} gcsUri
 * @param {String} encoding
 * @param {String} sampleRateHertz
 */
const transcribeAudio = async (gcsUri) => {
  /**
   * See more config options here
   * https://googleapis.dev/nodejs/speech/latest/google.cloud.speech.v2.IBatchRecognizeRequest.html
   */
  const request = {
    recognizer:
      'projects/podcast-admin/locations/europe-west4/recognizers/podcast-de-chirp',
    config: {
      model: 'chirp',
    },
    files: [{ uri: gcsUri }],
    recognitionOutputConfig: {
      gcsOutputConfig: {
        uri: `gs://${BUCKET}/${FILE.split('/').slice(0, -1).join('/')}`,
      },
    },
  };

  const [operation] = await client.batchRecognize(request);
  const [response] = await operation.promise();
  return response;
};

exports.uiEndpoint = onCall(
  (request) =>
    new Promise(async (resolve, reject) => {
      // Reject the call if the user is not authenticated
      if (!request.auth) {
        error('The user is not unauthenticated.', request);
        throw new HttpsError(
          'unauthenticated',
          'The user is not unauthenticated.',
        );
      }

      const token = request.auth.token;

      // Only admins are allowed to execute this operation
      if (!token.admin) {
        error('The user is not authorized to execute this operation.', request);
        throw new HttpsError(
          'permission-denied',
          'The user is not authorized to execute this operation.',
        );
      }

      const podcastId = request.data.podcastId;
      const episodeId = request.data.episodeId;

      const episodeDoc = collectionRef
        .doc(podcastId)
        .collection('episodes')
        .doc(episodeId);
      const episodeSnap = await episodeDoc.get();
      const originalAudioPath = episodeSnap.data().original_audio;

      const data = Buffer.from(originalAudioPath);
      const pubSubClient = new PubSub();
      pubSubClient
        .topic(PUBSUB_TOPIC)
        .publishMessage({ data })
        .then(() => resolve())
        .catch((e) => reject(e));
    }),
);

exports.pubsubEndpoint = onMessagePublished(
  { topic: PUBSUB_TOPIC },
  (event) =>
    new Promise(async (resolve, reject) => {
      const gcsUri = atob(event.data.message.data);
      transcribeAudio(gcsUri)
        .then((result) => {
          info(`Transcription of ${gcsUri} finished.`, result);
          resolve();
        })
        .catch((e) => {
          error(`Transcription of ${gcsUri} failed.`, e);
          reject();
        });
    }),
);

exports.check = onCall(async (request) =>
  client.checkLongRunningRecognizeProgress(request.data.name),
);
