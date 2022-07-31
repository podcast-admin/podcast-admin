const functions = require('firebase-functions');
const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();

const winston = require('winston');

// Imports the Google Cloud client library for Winston
const { LoggingWinston } = require('@google-cloud/logging-winston');

const bucket = 'gs://podcast-admin-backups';

const loggingWinston = new LoggingWinston();

// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    // Add Stackdriver Logging
    loggingWinston,
  ],
});

module.exports = functions
  .region('europe-west1')
  .pubsub.schedule('every 24 hours')
  .onRun(async (context) => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const databaseName = client.databasePath(projectId, '(default)');

    const [response] = await client.exportDocuments({
      name: databaseName,
      outputUriPrefix: bucket,
      // Leave collectionIds empty to export all collections
      // or set to a list of collection IDs to export,
      // collectionIds: ['users', 'posts']
      collectionIds: [],
    });

    logger.info(`Firestore export operation name: ${response['name']}`);
  });
