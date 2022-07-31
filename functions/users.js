const functions = require('firebase-functions');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

const db = getFirestore();
const collectionRef = db.collection('podcasts');

exports.list = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    const { podcastId } = data;
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'The user is not authorized.',
      );
    } else if (!context.auth.token.podcasts.includes(podcastId)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'The user is not authorized to access users of this podcast.',
      );
    }

    const userList = [];
    const podcastSnap = await collectionRef.doc(podcastId).get();

    for (let uid of podcastSnap.data().admins) {
      const userRecord = await getAuth().getUser(uid);

      userList.push({
        photoURL: userRecord.photoURL,
        displayName: userRecord.displayName,
        email: userRecord.email,
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
        providerIds: userRecord.providerData.map((data) => data.providerId),
      });
    }

    return userList;
  });
