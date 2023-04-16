const admin = require('firebase-admin');
const functions = require('firebase-functions');
const sharp = require('sharp');
const path = require('path');
const os = require('os');
const fs = require('fs');

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
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith('image/')) {
      return functions.logger.log('This is not an image.');
    }

    // Get the file name.
    const fileName = path.basename(filePath);
    const thumbFileName = `thumb_${fileName}`;

    // Exit if the image is already a thumbnail.
    if (fileName.startsWith('thumb_')) {
      return functions.logger.log('Already a Thumbnail.');
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
    await sharp(tempFilePath).resize(320, 240).toFile(tempThumbFilePath);
    functions.logger.log('Thumbnail created at', tempThumbFilePath);

    // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);

    // Uploading the thumbnail.
    await bucket.upload(tempThumbFilePath, {
      destination: thumbFilePath,
      metadata: metadata,
    });

    // Once the thumbnail has been uploaded delete the local file to free up disk space.
    return fs.unlinkSync(tempFilePath);
  });
