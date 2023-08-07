const { info } = require("firebase-functions/logger");
const pathToFfmpeg = require('ffmpeg-static');
const admin = require('firebase-admin');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const os = require('os');
const path = require('path');

const fileBucket = 'podcast-admin.appspot.com'; // The Storage bucket that contains the file.
var podcastFolder = 'podcasts',
  episodeFolder = 'episodes',
  podcastFolderBucketPath = '',
  episodeFolderBucketPath = '';

exports.processAudioFile = async ({ podcastId, episodeId }) => {
  podcastFolderBucketPath = [podcastFolder, podcastId].join('/');
  episodeFolderBucketPath = [
    podcastFolder,
    podcastId,
    episodeFolder,
    episodeId,
  ].join('/');

  info(`Processing ${episodeFolderBucketPath}...`);

  const rawEpisodeBucketPath = await getOriginalAudioPath(episodeId); // File path in the bucket.

  const finalEpisodeBucketPath =
    episodeFolderBucketPath + '/' + episodeId + '.mp3';

  var finalEpisodeBucketFile = '',
    finalEpisodeLocalPath = '';

  const rawEpisodeLocalPath = await downloadFile(
    fileBucket,
    rawEpisodeBucketPath,
  );
  const introOutroBucketPaths = await getIntroOutroFilePath(episodeId);

  if (introOutroBucketPaths) {
    const introLocalPath = await downloadFile(
      fileBucket,
      podcastFolderBucketPath + '/' + introOutroBucketPaths['intro'],
    );
    const outroLocalPath = await downloadFile(
      fileBucket,
      podcastFolderBucketPath + '/' + introOutroBucketPaths['outro'],
    );

    finalEpisodeLocalPath = await addIntroOutro(
      introLocalPath,
      outroLocalPath,
      rawEpisodeLocalPath,
    );

    finalEpisodeBucketFile = await uploadFile(
      finalEpisodeLocalPath,
      finalEpisodeBucketPath,
    );
  } else {
    finalEpisodeLocalPath = rawEpisodeLocalPath;
    finalEpisodeBucketFile = await copyOriginalAudio(
      rawEpisodeBucketPath,
      finalEpisodeBucketPath,
    );
  }

  // Get the public URL to our new audio file
  const finalEpisodeBucketUrl = finalEpisodeBucketFile.metadata.mediaLink;

  const duration = await getAudioDurationInSeconds(finalEpisodeLocalPath);

  await saveEpisode(episodeFolderBucketPath, duration, finalEpisodeBucketUrl);

  cleanUp();
};

const copyOriginalAudio = async (originalAudioPath, destinationAudioPath) => {
  const copyResponse = await admin
    .storage()
    .bucket(fileBucket)
    .file(originalAudioPath)
    .copy(destinationAudioPath);

  return copyResponse[0];
};

const downloadFile = async (fileBucket, filePath) => {
  const fileName = path.basename(filePath);
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);

  await bucket
    .file(filePath)
    .download({ destination: tempFilePath, validation: false });

  return tempFilePath;
};

const uploadFile = async (localFilePath, filePath) => {
  const bucket = admin.storage().bucket(fileBucket);
  const uploadResponse = await bucket.upload(localFilePath, {
    resumable: false,
    destination: filePath,
    validation: false,
    public: true,
  });

  return uploadResponse[0];
};

const saveEpisode = async (dbPath, duration, epsiodeUrl) => {
  const data = {
    duration: Math.round(duration),
    url: epsiodeUrl,
    processing: 'done',
    audioProcessedAt: new Date(),
  }

  await admin
    .firestore()
    .doc(dbPath)
    .set(
      data,
      { merge: true },
    );

    info('Updated episode doc in Firestore. See data in jsonPayload.', data);
};

const getIntroOutroFilePath = async () => {
  const podcast = await admin.firestore().doc(podcastFolderBucketPath).get();
  const episode = await admin.firestore().doc(episodeFolderBucketPath).get();
  const data = episode.data();

  if (data.intro && data.outro) {
    return {
      intro: podcast.data().intro[data.intro],
      outro: podcast.data().outro[data.outro],
    };
  } else {
    return false;
  }
};

const getOriginalAudioPath = async (episodeId) => {
  const episode = await admin.firestore().doc(episodeFolderBucketPath).get();

  return episode.data().audio_original;
};

const getAudioDurationInSeconds = (path) => {
  var duration = 0;

  return new Promise((resolve, reject) => {
    ffmpeg()
      .setFfmpegPath(pathToFfmpeg)
      .input(path)
      .toFormat('null')
      .output('-')
      .on('start', function (commandLine) {
        // Do nothing, maybe log something: console.log('Spawned Ffmpeg with command: ' + commandLine);
      })
      .on('progress', function (progress) {
        var a = progress.timemark.split(':');
        duration = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
      })
      .on('end', function () {
        resolve(duration);
      })
      .run();
  });
};

const getIntroOutroOverlap = async () => {
  const podcast = await admin.firestore().doc(podcastFolderBucketPath).get();
  const { introOverlap, outroOverlap } = podcast.data();

  return { introOverlap, outroOverlap };
};

const addIntroOutro = async (intro, outro, episode) => {
  const introDation = (await getAudioDurationInSeconds(intro)) * 1000;
  const episodeDuration = (await getAudioDurationInSeconds(episode)) * 1000;

  const { introOverlap, outroOverlap } = await getIntroOutroOverlap();

  return new Promise((resolve, reject) => {
    const outputPath = '/tmp/ffmpeg-result.mp3';

    try {
      ffmpeg()
        .setFfmpegPath(pathToFfmpeg)
        .input(intro)
        .input(episode)
        .input(outro)
        .complexFilter(
          `[0]adelay=0|0,volume=2[a0];[1]adelay=${
            introDation - introOverlap
          }:all=1,volume=2[a1];[2]adelay=${
            introDation - introOverlap + episodeDuration - outroOverlap
          }:all=1,volume=1.6[a2];[a0][a1][a2]amix=inputs=3:dropout_transition=99999[a]`,
          '[a]',
        )
        .output(outputPath)
        .on('start', function (commandLine) {
          // Do nothing, maybe log something: console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('end', function () {
          resolve(outputPath);
        })
        .run();
    } catch (e) {
      reject(e);
    }
  });
};

const cleanUp = () => {
  const directory = '/tmp';

  fs.readdir(directory, (err, files) => {
    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {});
    }
  });
};
