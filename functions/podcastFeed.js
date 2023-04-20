const admin = require('firebase-admin');
const functions = require('firebase-functions');

const generateFeed = require('./lib/generateFeed.js').generateFeed;
const getFeedXML = require('./lib/podcastFeedXML').getFeedXML;

exports.getFeed = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    const podcastId = req.path.substr(1, req.path.length);

    return getFeedXML(podcastId)
      .then((xml) => {
        res.status(200).type('application/rss+xml').send(xml);
      })
      .catch((e) => {
        if (e.name === 'PodcastNotFound') {
          res.status(404).send('podcast not found');
          return false;
        } else {
          res.status(500).send(e);
        }
      });
  });

exports.generateAllFeeds = functions
  .region('europe-west1')
  .pubsub.schedule('0 1 * * *')
  .timeZone('Europe/Berlin')
  .onRun(async () => {
    let podcastsRef = admin.firestore().collection('podcasts');

    return podcastsRef
      .get()
      .then(async (snapshot) => {
        var tasks = [];
        snapshot.forEach((podcast) => {
          tasks.push(generateFeed(podcast.id));
        });
        await Promise.all(tasks);
      })
      .catch((err) => {
        functions.logger.log('Error getting documents', err);
      });
  });
