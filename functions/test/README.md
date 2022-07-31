To run tests, run the shell `firebase functions:shell`

## Test storage trigger
Get test data here: https://developers.google.com/oauthplayground/?code=4/0AY0e-g4w-UjlPwBbzOWeq5pkIyP4sJAIR2qd5Az5z8siC_757TigXTkxltk955tR_qEpLQ&scope=https://www.googleapis.com/auth/devstorage.read_only

Use path (`https://www.googleapis.com/storage/v1/b/{bucket}/o/{object}`) as object but with %2F instead of /. E.g. `https://www.googleapis.com/storage/v1/b/logs-bucket-podcast-admin/o/podcast-admin.appspot.com_usage_2021_06_03_02_00_00_0aa60fe1910117d623_v0`

Then import some test data `var testData = require('./test/episodeDuration/testData.json');`

Then call the function `calculateEpisodeDuration(testData);`

## Test firestore trigger
Adjust / run `test-onEpisodeUpdate.js`