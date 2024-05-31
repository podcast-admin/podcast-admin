const { PubSub } = require('@google-cloud/pubsub');
const { SpeechClient } = require('@google-cloud/speech').v2;
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const {
  logger: { error, info },
  https: { HttpsError },
} = require('firebase-functions');
const { onCall } = require('firebase-functions/v2/https');
const { onMessagePublished } = require('firebase-functions/v2/pubsub');
const yup = require('yup');

const { IS_DEBUG } = require('../constants');

const bucket = getStorage().bucket();
const db = getFirestore();

const PUBSUB_TOPIC = 'elearning-report';

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

  info(`Transcribing ${gcsUri}...`);
  const [operation] = await client.batchRecognize(request);
  info(`Transcription of ${gcsUri} started... `, { operation });
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

      const episodePath = `podcasts/${podcastId}/episodes/${episodeId}`;

      const episodeDoc = db.doc(episodePath);
      await episodeDoc.update({
        'transcript.status': 'processing',
      });

      const pubSubClient = new PubSub();

      // Speech recognition can't run against emulators so we skip it in dev
      if (!IS_DEBUG) {
        pubSubClient
          .topic(PUBSUB_TOPIC)
          .publishMessage({ data: Buffer.from(episodePath) })
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        resolve();
      }
    }),
);

exports.pubsubEndpoint = onMessagePublished(
  { topic: PUBSUB_TOPIC },
  (event) =>
    new Promise(async (resolve, reject) => {
      const episodeDoc = db.doc(atob(event.data.message.data));
      const episodeSnap = await episodeDoc.get();
      const audioOriginal = episodeSnap.data().audio_original;
      const gcsUri = `gs://${bucket.id}/${audioOriginal}`;

      transcribeAudio(gcsUri)
        .then(async (result) => {
          try {
            const ourResult = result.results[gcsUri];
            if (ourResult.error) {
              await episodeDoc.update({
                transcript: {
                  errorMessage: ourResult.error.message,
                  status: 'error',
                },
              });
              error(`Transcription of ${gcsUri} failed.`, {
                error: ourResult.error,
                result,
              });
              reject(ourResult.error);
            } else {
              const transcriptGcsUri = ourResult.uri;
              await episodeDoc.update({
                transcript: { gcsUri: transcriptGcsUri, status: 'done' },
              });

              info(`Transcription of ${gcsUri} finished.`, { result });
              resolve();
            }
          } catch (e) {
            error(`Saving transcription data ${gcsUri} failed.`, { e, result });
            reject(e);
          }
        })
        .catch(async (e) => {
          error(`Transcription of ${gcsUri} failed.`, { e });
          episodeDoc.update({
            transcript: { errorMessage: e.message, status: 'error' },
          });
          reject(e);
        });
    }),
);

exports.check = onCall(async (request) =>
  client.checkLongRunningRecognizeProgress(request.data.name),
);
