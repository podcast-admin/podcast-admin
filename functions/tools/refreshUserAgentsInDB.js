/**
 * This file downloads the entire bigquery logs, parses user agents for each log entry and then
 * upload-replaces the bigquery database with that enriched data.
 */

// Import the Google Cloud client library using default credentials
const {BigQuery} = require('@google-cloud/bigquery');
const PodcastUserAgentParser = require('podcast-user-agent-parser');

const bigquery = new BigQuery();
const fs = require('fs')
const jsonexport = require('jsonexport');

async function query() {
  
  const datasetId = 'storageanalysis';
  const tableId = 'episode_requests'

  const query = `
    SELECT *
      FROM \`podcast-admin.${datasetId}.${tableId}\``;

  // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
  const options = {
    query: query,
    // Location must match that of the dataset(s) referenced in the query.
    location: 'US',
  };

  // Run the query as a job
  const [job] = await bigquery.createQueryJob(options);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();

  const parser = await new PodcastUserAgentParser();
  const results = [];

  rows.forEach(row => {
    let userAgent = parser.parse(row.cs_user_agent);
    if(userAgent) {
      results.push({
        ...row,
        'cs_user_agent_device': userAgent.device,
        'cs_user_agent_os': userAgent.os,
        'cs_user_agent_app': userAgent.app,
        'cs_user_agent_bot': userAgent.bot ? true : false
      });
    }else{
      results.push(row);
    }
  });

  const csv = await jsonexport(results, {
    forceTextDelimiter: true,
    includeHeaders: false
  });

  fs.writeFile('data.csv', csv, err => {
    if (err) {
      console.error(err)
      return
    }
  });

  //-
  // You may also pass in metadata in the format of a Jobs resource. See
  // (https://cloud.google.com/bigquery/docs/reference/rest/v2/Job#JobConfigurationLoad)
  // for a full list of supported values.
  //-
  const metadata = {
    writeDisposition: "WRITE_TRUNCATE"
  };

  await bigquery
    .dataset(datasetId)
    .table(tableId)
    .load('./data.csv', metadata, (err, apiResponse) => console.log(err));
}

query();