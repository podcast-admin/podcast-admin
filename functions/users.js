const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const functions = require('firebase-functions');

const db = getFirestore();
const collectionRef = db.collection('podcasts');

exports.list = functions
  .region('europe-west3')
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

    for (const uid of podcastSnap.data().admins) {
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

exports.processInvites = functions
  .region('europe-west3')
  .https.onCall(async (data, context) => {
    const { uid, email } = context.auth.token;
    let shouldRefreshIdToken = false;

    const podcastsSnap = await collectionRef
      .where('invitedAdmins', 'array-contains', email)
      .get();

    const podcastIds = [];
    for (const doc of podcastsSnap.docs) {
      podcastIds.push(doc.id);
      await doc.ref.update({
        admins: FieldValue.arrayUnion(uid),
        invitedAdmins: FieldValue.arrayRemove(email),
      });
    }

    if (podcastIds.length > 0) {
      await getAuth().setCustomUserClaims(uid, {
        podcasts: podcastIds,
      });
      shouldRefreshIdToken = true;
    }

    return { shouldRefreshIdToken };
  });
