const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const RSS = require('rss');
const showdown = require('showdown');

const getUrl = (episodeData) => {
  const url = new URL(episodeData.url);
  if (episodeData.audioProcessedAt) {
    url.searchParams.set('t', episodeData.audioProcessedAt.toDate().getTime());
  }
  return url.toString();
};

exports.getFeedXML = async (podcastId) => {
  if (!podcastId) {
    return Promise.reject(new PodcastNotFoundException('Empty podcastId'));
  }

  const db = getFirestore();
  const collectionRef = db.collection('podcasts');
  const converter = new showdown.Converter({
    requireSpaceBeforeHeadingText: true,
  });
  const podcastRef = collectionRef.doc(podcastId);
  const episodesRef = collectionRef.doc(podcastId).collection('episodes');

  const podcastDoc = await podcastRef.get();
  if (podcastDoc.exists) {
    const podcastData = podcastDoc.data();
    const feed = new RSS({
      custom_namespaces: {
        googleplay: 'http://www.google.com/schemas/play-podcasts/1.0',
        itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      },
      title: podcastData.name,
      feed_url: `http://podcast-admin.firebaseapp.com/feed/${podcastDoc.id}`,
      site_url: podcastData.website,
      image_url: podcastData.image,
      description: podcastData.description,
      language: podcastData.language,
      categories: [podcastData.category],
      copyright: podcastData.copyright,
      custom_elements: [
        { 'googleplay:author': podcastData.author },
        { 'googleplay:category': podcastData.category },
        { 'googleplay:description': podcastData.description },
        { 'googleplay:explicit': podcastData.explicit },
        {
          'googleplay:image': {
            _attr: {
              href: podcastData.image,
            },
          },
        },

        { 'itunes:author': podcastData.author },
        { 'itunes:summary': podcastData.description },
        {
          'itunes:category': {
            _attr: {
              text: podcastData.category,
            },
          },
        },
        { 'itunes:explicit': podcastData.explicit },
        { 'itunes:subtitle': podcastData.subtitle },
        {
          'itunes:image': {
            _attr: {
              href: podcastData.image,
            },
          },
        },
        {
          'itunes:owner': [
            { 'itunes:name': podcastData.author },
            { 'itunes:email': podcastData.email },
          ],
        },
      ],
    });

    const querySnapshot = await episodesRef
      .where('date', '<', Timestamp.fromDate(new Date()))
      .get();

    querySnapshot.forEach((episodeDoc) => {
      const episodeData = episodeDoc.data();

      feed.item({
        guid: episodeDoc.id,
        url: podcastData.episode_url_prefix + episodeDoc.id,
        title: episodeData.title,
        description: converter.makeHtml(
          episodeData.description + '\n\n' + podcastData.footer,
        ),
        author: episodeData.author || podcastData.author,
        date: episodeData.date.toDate(),
        enclosure: {
          url: getUrl(episodeData),
          type: 'audio/mpeg',
          size: episodeData.length,
        },
        custom_elements: [
          { 'itunes:author': episodeData.author || podcastData.author },
          { 'itunes:subtitle': episodeData.subtitle },
          { 'itunes:episodeType': episodeData.type },
          {
            'itunes:image': {
              _attr: {
                href: episodeData.image,
              },
            },
          },
          { 'itunes:duration': episodeData.duration },
        ],
      });
    });

    return feed.xml({ indent: true });
  } else {
    return Promise.reject(new PodcastNotFoundException());
  }
};

function PodcastNotFoundException(message) {
  this.message = message || 'podcast not found';
  this.name = 'PodcastNotFound';
}
