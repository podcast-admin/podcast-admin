const speech = require('@google-cloud/speech');
const pathToFfmpeg = require('ffmpeg-static');
const { path: pathToFfprobe } = require('ffprobe-static');
const admin = require('firebase-admin');
const { onRequest } = require('firebase-functions/v2/https');
const ffmpeg = require('fluent-ffmpeg');
const os = require('os');
const path = require('path');

const BUCKET = 'podcast-admin.appspot.com';
const FILE =
  'podcasts/2T9aVqEJhvd1Fck2vVPp/episodes/digitale-services-in-2024/original-audio-1708153834380.wav';

const downloadFile = async (fileBucket, filePath) => {
  const fileName = path.basename(filePath);
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);

  await bucket
    .file(filePath)
    .download({ destination: tempFilePath, validation: false });

  return tempFilePath;
};

/**
 *
 * @param {String} fileName
 * @return {Promise<String>}
 */
const getAudioMetadata = async (fileName) => {
  const audioFilePath = await downloadFile(BUCKET, fileName);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .setFfmpegPath(pathToFfmpeg)
      .setFfprobePath(pathToFfprobe)
      .input(audioFilePath)
      .ffprobe((err, data) => {
        if (err) {
          reject(err);
        } else {
          const { codec_name, sample_rate } = data.streams[0];
          resolve({ codec_name, sample_rate });
        }
      });
  });
};

/**
 *
 * @param {String} gcsUri
 * @param {String} encoding
 * @param {String} sampleRateHertz
 */
const transcribeAudio = async (gcsUri, encoding, sampleRateHertz) => {
  // https://cloud.google.com/speech-to-text/docs/reference/rest/v1/RecognitionConfig#audioencoding
  const languageCode = 'de-DE';

  const client = new speech.SpeechClient();

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };

  const audio = {
    uri: gcsUri,
  };

  const request = {
    config: config,
    audio: audio,
    outputConfig: {
      gcsUri: `gs://${BUCKET}/podcasts/2T9aVqEJhvd1Fck2vVPp/episodes/digitale-services-in-2024/transcript.json`,
    },
  };

  return await client.longRunningRecognize(request); // Not sure if it works... we need to list running processes
};

const getEncoding = (codec) => {
  switch (codec) {
    case 'pcm_s24le':
      return 'LINEAR16';
    case 'mp3':
      return 'MP3';
    default:
      return 'ENCODING_UNSPECIFIED';
  }
};

module.exports = onRequest(async (req, res) => {
  try {
    const { codec_name, sample_rate } = await getAudioMetadata(FILE);
    const result = await transcribeAudio(
      `gs://${BUCKET}/${FILE}`,
      getEncoding(codec_name),
      sample_rate,
    );
    res.send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});
