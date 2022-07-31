var snap = {
    before: {
        audio_original: 'podcasts/2T9aVqEJhvd1Fck2vVPp/episodes/test/original-1616595453661.mp3',
        intro: 'main',
        outro: 'default'
    },
    after: {
        audio_original: 'podcasts/2T9aVqEJhvd1Fck2vVPp/episodes/test/original-1616662438524.mp3',
        intro: 'main',
        outro: 'default'
    }
};

var context = {
    params: {
        podcastId: '2T9aVqEJhvd1Fck2vVPp',
        episodeId: 'test'
    }
}

onEpisodeUpdate(snap, context);