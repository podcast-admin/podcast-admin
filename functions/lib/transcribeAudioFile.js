const pathToFfmpeg = require('ffmpeg-static');
const { path: pathToFfprobe } = require('ffprobe-static');
const admin = require('firebase-admin');
const { onRequest } = require('firebase-functions/v2/https');
const ffmpeg = require('fluent-ffmpeg');
const os = require('os');
const path = require('path');
const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient();

const downloadFile = async (fileBucket, filePath) => {
  const fileName = path.basename(filePath);
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);

  await bucket
    .file(filePath)
    .download({ destination: tempFilePath, validation: false });

  return tempFilePath;
};

const getAudioMetadata = async () => {
  const audioFilePath = await downloadFile(
    'podcast-admin.appspot.com',
    '/podcasts/my-podcast/episodes/mytestwisdom/original-audio-1657635984929.mp3',
  );

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

module.exports = onRequest(async (req, res) => {
  const result = await getAudioMetadata();
  res.send(result);
});
