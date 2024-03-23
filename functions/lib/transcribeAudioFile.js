const { PubSub } = require('@google-cloud/pubsub');
const { SpeechClient } = require('@google-cloud/speech').v2;
const { getFirestore } = require('firebase-admin/firestore');
const {
  logger: { error, info },
  https: { HttpsError },
} = require('firebase-functions');
const { onCall } = require('firebase-functions/v2/https');
const { onMessagePublished } = require('firebase-functions/v2/pubsub');
const yup = require('yup');

const BUCKET = 'podcast-admin.appspot.com';
const PUBSUB_TOPIC = 'elearning-report';

const db = getFirestore();
const collectionRef = db.collection('podcasts');

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
        uri: gcsUri.split('/').slice(0, -1).join('/'),
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
      const requestDataSchema = yup.object({
        podcastId: yup.string().required(),
        episodeId: yup.string().required(),
      });

      // Reject the call if the required data is not provided
      try {
        requestDataSchema.validateSync(request.data);
      } catch (e) {
        error('The user is not unauthenticated.', request);
        throw new HttpsError('invalid-argument', e.message);
      }

      const podcastId = request.data.podcastId;
      const episodeId = request.data.episodeId;

      // Reject the call if the user is not authenticated
      if (!request.auth) {
        error('The user is not unauthenticated.', request);
        throw new HttpsError(
          'unauthenticated',
          'The user is not unauthenticated.',
        );
      }

      const token = request.auth.token;

      // Only owners of the podcast are allowed to execute this operation
      if (!token.podcasts?.includes(podcastId)) {
        error('The user is not authorized to execute this operation.', request);
        throw new HttpsError(
          'permission-denied',
          'The user is not authorized to execute this operation.',
        );
      }

      // Getting original audio file and updating firestore should happen in pubsub func
      const episodeDoc = collectionRef
        .doc(podcastId)
        .collection('episodes')
        .doc(episodeId);
      const episodeSnap = await episodeDoc.get();
      const audioOriginalPath = episodeSnap.data().audio_original;

      const data = Buffer.from(audioOriginalPath);
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
      transcribeAudio(`gs://${BUCKET}/${gcsUri}`)
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
