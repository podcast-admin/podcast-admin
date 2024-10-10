const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const functions = require('firebase-functions');

module.exports = functions
  .region('europe-west3')
  .https.onRequest(async (req, res) => {
    const db = admin.firestore();
    const uid = req.query.uid;

    const podcastsSnap = await db
      .collection('podcasts')
      .where('admins', 'array-contains', uid)
      .get();

    getAuth()
      .setCustomUserClaims(uid, {
        podcasts: podcastsSnap.docs.map((d) => d.id),
      })
      .then(() => {
        res.status(200).send('Success!');
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  });
