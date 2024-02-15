const generateFeed = require('./lib/generateFeed.js').generateFeed;
const processAudioFile = require('./processAudioFile.js').processAudioFile;

exports.onEpisodeCreate = async (snap, context) => {
  // Get the podcastId from the environment
  const podcastId = context.params.podcastId;
  const data = snap.data();

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
  const podcastId = context.params.podcastId;
  const dataBefore = snap.before.data();
  const dataAfter = snap.after.data();

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

  if (
    dataBefore.date.seconds !== dataAfter.date.seconds ||
    dataBefore.description !== dataAfter.description ||
    dataBefore.image !== dataAfter.image ||
    dataBefore.length !== dataAfter.length ||
    dataBefore.subtitle !== dataAfter.subtitle ||
    dataBefore.title !== dataAfter.title ||
    dataBefore.type !== dataAfter.type ||
    dataBefore.url !== dataAfter.url
  ) {
    // Generate new feeds
    await generateFeed(podcastId);
  }

  return true;
};
