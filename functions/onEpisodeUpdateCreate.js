const generateFeed = require('./lib/generateFeed.js').generateFeed;
const processAudioFile = require('./processAudioFile.js').processAudioFile;

exports.onEpisodeCreate = async (snap, context) => {
  // Get the podcastId from the environment
  let podcastId = context.params.podcastId;
  let data = snap.data();

  if (data.audio_original) {
    await processAudioFile({
      podcastId: context.params.podcastId,
      episodeId: context.params.episodeId,
    });
  }

  // Generate new feeds
  await generateFeed(podcastId);

  return true;
};

exports.onEpisodeUpdate = async (snap, context) => {
  // Get the podcastId from the environment
  let podcastId = context.params.podcastId;
  let dataBefore = snap.before.data();
  let dataAfter = snap.after.data();

  if (
    dataAfter.processing === 'restart' ||
    dataBefore.audio_original !== dataAfter.audio_original || // Did the orignal audio change?
    dataBefore.intro !== dataAfter.intro || // Did the intro change?
    dataBefore.outro !== dataAfter.outro // Did the outro change?
  ) {
    await processAudioFile({
      podcastId: context.params.podcastId,
      episodeId: context.params.episodeId,
    });
  }

  // Generate new feeds
  await generateFeed(podcastId);

  return true;
};
