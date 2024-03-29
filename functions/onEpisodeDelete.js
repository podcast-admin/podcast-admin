const generateFeed = require('./lib/generateFeed.js').generateFeed;

module.exports = async (snap, context) => {
  // Get the podcastId from the environment
  const podcastId = context.params.podcastId;

  // Generate new feeds
  await generateFeed(podcastId);

  return true;
};
