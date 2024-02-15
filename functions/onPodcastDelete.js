const { Storage } = require('@google-cloud/storage');
const { info } = require('firebase-functions/logger');

exports.onPodcastDelete = async (snap, context) => {
  const storage = new Storage();
  const bucket = storage.bucket('podcast-admin.appspot.com');

  // Get the episodeId from the environment
  const episodeId = context.params.episodeId;

  // List all the files under the bucket
  const [files] = await bucket.getFiles();

  // Filter only files that belong to "folder" episodeId, aka their file.name contains "episodeId/"
  const dirFiles = files.filter((f) =>
    f.name.includes('/episodes/' + episodeId + '/'),
  );

  // Delete the files
  dirFiles.forEach(async (file) => {
    await file.delete();
    info('Deleted ', file.name);
  });
};
