const { BigQuery } = require('@google-cloud/bigquery');
const csv = require('csv-parser');
const admin = require('firebase-admin');
const { info, error } = require('firebase-functions/logger');
const UserAgentParser = require('podcast-user-agent-parser');

// Instantiates a client
const storage = admin.storage();
const bigquery = new BigQuery();

/**
 * Reads log data from Cloud Storage, enriches with user agent data and writes to BigQuery.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */
exports.loadFile = async (data, context) => {
  const datasetId = 'storageanalysis';
  const tableId = 'episode_requests';

  const file = storage.bucket(data.bucket).file(data.name);

  if (data.name.includes('usage')) {
    const parser = await new UserAgentParser();

    const getRows = new Promise((resolve, reject) => {
      const result = [];
      file
        .createReadStream()
        .pipe(csv())
        .on('data', (data) => result.push(data))
        .on('end', () => resolve(result))
        .on('error', (e) => reject(e));
    });

    const rows = await getRows;

    const result = [];
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].cs_uri.includes('.mp3')) {
        const userAgent = parser.parse(rows[i].cs_user_agent);
        if (userAgent) {
          result.push({
            ...rows[i],
            cs_user_agent_app: userAgent.app,
            cs_user_agent_os: userAgent.os,
            cs_user_agent_device: userAgent.device,
            cs_user_agent_bot: userAgent.bot,
          });
        } else {
          result.push(rows[i]);
        }
      }
    }

    if (result.length > 0) {
      bigquery
        .dataset(datasetId)
        .table(tableId)
        .insert(result)
        .catch((e) => {
          error('ERROR:', e);
        });

      await file.delete();
      info(
        `Results added to ${datasetId}.${tableId}, deleted gs://${data.bucket}/${data.name}`,
      );
    } else {
      await file.delete();
      info(`Nothing to load, so deleted gs://${data.bucket}/${data.name}`);
    }
  } else {
    await file.delete();
    info(`Did not load but deleted gs://${data.bucket}/${data.name}`);
  }
};
