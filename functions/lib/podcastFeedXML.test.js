const admin = require('firebase-admin');
const sinon = require('sinon');
const { XmlDocument } = require('xmldoc');
const { getFeedXML } = require('./podcastFeedXML');

const test = require('firebase-functions-test')({
  projectId: process.env.GCLOUD_PROJECT,
});

describe('PodcastFeedXML library', () => {
  beforeAll(() => {
    admin.apps.length === 0 && admin.initializeApp();
    sinon.stub(admin, 'initializeApp');
  });

  afterAll(() => {
    test.cleanup();
    admin.initializeApp.restore();
  });

  it('throws an error if no podcast was found', async () => {
    try {
      await getFeedXML('2T9aVqEJhvd1Fck2vVPp');
    } catch (e) {
      expect(e.message).toMatch('podcast not found');
    }
  });

  it('returns a podcast feed with valid podcast title', async () => {
    const feed = await getFeedXML('my-podcast');
    const xmlDoc = new XmlDocument(feed);
    expect(xmlDoc.valueWithPath('channel.title')).toBe('My Podcast');
  });
});
