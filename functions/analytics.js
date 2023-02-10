const functions = require('firebase-functions');
const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

exports.totalDownloads = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    if (!data?.podcastId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'No podcast specified',
      );
    }
    const { podcastId } = data;

    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The user is not authorized.',
      );
    } else if (!context.auth.token.podcasts.includes(podcastId)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'The user is not authorized to access users of this podcast.',
      );
    }

    const datasetId = 'storageanalysis';
    const tableId = 'episode_requests';

    const query = `
    SELECT
    REGEXP_EXTRACT(cs_object, r'^podcasts/.+/episodes/(.+)/') as episodeId, COUNT(*) as num
    FROM
      \`podcast-admin.${datasetId}.${tableId}\`
    WHERE
      SC_STATUS = 200
      AND CONTAINS_SUBSTR(cs_object, 'mp3')
      AND CONTAINS_SUBSTR(cs_object, '2T9aVqEJhvd1Fck2vVPp')
    group by cs_object
    order by num desc`;

    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
      query: query,
      // Location must match that of the dataset(s) referenced in the query.
      location: 'US',
    };

    try {
      // Run the query as a job
      const [job] = await bigquery.createQueryJob(options);

      // Wait for the query to finish
      const [rows] = await job.getQueryResults();

      return rows;
    } catch (e) {
      return e;
    }
  });
