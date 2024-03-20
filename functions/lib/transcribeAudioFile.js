const { SpeechClient } = require('@google-cloud/speech').v2;
const { onRequest } = require('firebase-functions/v2/https');

const BUCKET = 'podcast-admin.appspot.com';

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

exports.run = onRequest(async (req, res) => {
  try {
    const result = await transcribeAudio(`gs://${BUCKET}/${FILE}`);
    res.send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});

exports.check = onRequest(async (req, res) => {
  try {
    const operation = await client.checkLongRunningRecognizeProgress(
      req.query.name,
    );
    res.send(operation);
  } catch (e) {
    res.status(500).send(e);
  }
});
