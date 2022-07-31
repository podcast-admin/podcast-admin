const { info } = require('firebase-functions/lib/logger');
const { Storage } = require('@google-cloud/storage');

exports.onPodcastDelete = async (snap, context) => {
  const storage = new Storage();
  const bucket = storage.bucket('podcast-admin.appspot.com');

  // Get the episodeId from the environment
  let episodeId = context.params.episodeId;

  // List all the files under the bucket
  let [files] = await bucket.getFiles();

  // Filter only files that belong to "folder" episodeId, aka their file.name contains "episodeId/"
  let dirFiles = files.filter((f) =>
    f.name.includes('/episodes/' + episodeId + '/'),
  );

  // Delete the files
  dirFiles.forEach(async (file) => {
    await file.delete();
    info('Deleted ', file.name);
  });
};
