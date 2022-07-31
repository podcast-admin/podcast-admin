const admin = require('firebase-admin');
const sinon = require("sinon");

const getFeedXML = require('../lib/podcastFeedXML').getFeedXML;

// Initialize the firebase-functions-test SDK using environment variables.
// These variables are automatically set by firebase emulators:exec
//
// This configuration will be used to initialize the Firebase Admin SDK, so
// when we use the Admin SDK in the tests below we can be confident it will
// communicate with the emulators, not production.
const test = require("firebase-functions-test")({
  projectId: process.env.GCLOUD_PROJECT,
});

describe("PodcastFeedXML library", () => {
  beforeAll(() => {
    admin.apps.length === 0 && admin.initializeApp();
    adminInitStub = sinon.stub(admin, "initializeApp");
    _fns = require('../index');
  });

  afterAll(() => {
    test.cleanup();
    admin.initializeApp.restore();
  });

  it("throws an error if no podcast was found", async () => {
    try {
      await getFeedXML('2T9aVqEJhvd1Fck2vVPp')
    } catch (e) {
      expect(e.message).toMatch('podcast not found');
    }
  });
});