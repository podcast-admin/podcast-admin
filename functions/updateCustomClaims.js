const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const functions = require('firebase-functions');

module.exports = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    const db = admin.firestore();
    const uid = context.auth.uid;

    const podcastsSnap = await db
      .collection('podcasts')
      .where('admins', 'array-contains', uid)
      .get();

    await getAuth().setCustomUserClaims(uid, {
      podcasts: podcastsSnap.docs.map((d) => d.id),
    });
  });
