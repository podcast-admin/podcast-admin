const functions = require('firebase-functions');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

const db = getFirestore();
const collectionRef = db.collection('podcasts');

exports.list = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    const { podcastId } = data;
    const userList = [];
    const podcastSnap = await collectionRef.doc(podcastId).get();

    for (let uid of podcastSnap.data().admins) {
      const userRecord = await getAuth().getUser(uid);

      userList.push(userRecord);
    }

    return userList;
  });
