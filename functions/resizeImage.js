const admin = require('firebase-admin');
const functions = require('firebase-functions');
const sharp = require('sharp');
const path = require('path');
const os = require('os');
const fs = require('fs');

/**
 * The dimensions of the thumbnail image.
 */
const THUMP_SIZE = {
  width: 800,
  height: 800,
};

const THUMP_PREFIX = 'thumb_';

/**
 *
 * @param {string} imageUrl The URL to the episode image. Must be on a Google Storage Bucket.
 */
module.exports = functions
  .region('europe-west1')
  .storage.bucket('podcast-admin.appspot.com')
  .object()
  .onFinalize(async (object) => {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.

    const filePathMatches = filePath.match(/(\S+)\/.*/);
    const collectionPath = filePathMatches[1];

    // Get the file name.
    const fileName = path.basename(filePath);

    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith('image/')) {
      return functions.logger.log(
        `This is not an image: ${filePath} (${contentType})`,
      );
    }

    // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
    const thumbFileName = `${THUMP_PREFIX}${fileName}`;
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);

    // Exit if the image is already a thumbnail.
    if (fileName.startsWith(THUMP_PREFIX)) {
      return functions.logger.log(`Already a thumbnail: ${fileName}`);
    }

    // Download file from bucket.
    const bucket = admin.storage().bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const tempThumbFilePath = path.join(os.tmpdir(), thumbFileName);
    const metadata = {
      contentType: contentType,
    };
    await bucket.file(filePath).download({ destination: tempFilePath });
    functions.logger.log('Image downloaded locally to', tempFilePath);

    // Generate a thumbnail using sharp.
    await sharp(tempFilePath)
      .resize(THUMP_SIZE.width, THUMP_SIZE.height)
      .toFile(tempThumbFilePath);
    functions.logger.log('Thumbnail created at', tempThumbFilePath);

    // Uploading the thumbnail.
    const [file] = await bucket.upload(tempThumbFilePath, {
      destination: thumbFilePath,
      metadata: metadata,
      public: true,
    });

    const url = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 24 * 60 * 1000, // doesn't work long time
    });

    await admin
      .firestore()
      .doc(collectionPath)
      .set({ imageAlternatives: [{ url, ...THUMP_SIZE }] }, { merge: true });

    // Once the thumbnail has been uploaded delete the local file to free up disk space.
    return fs.unlinkSync(tempFilePath);
  });
