const admin = require('firebase-admin');
const functions = require('firebase-functions');

const podcastFeed = require('./podcastFeedXML');

/**
 * Generates the XML feed for the given podcast and uploads the feed to the correct bucket.
 */
exports.generateFeed = async (podcastId) => {
  const bucket = admin.storage().bucket();
  const file = bucket.file(`podcasts/${podcastId}/feed.xml`);

  const feedXML = await podcastFeed.getFeedXML(podcastId);

  try {
    await file.save(feedXML, { validation: false });
    await file.setMetadata({ contentType: 'application/rss+xml' });
    await file.makePublic();
  } catch (e) {
    functions.logger.log(e);
  }
};
