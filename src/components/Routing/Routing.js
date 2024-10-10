import React from 'react';
import { Routes, Route } from 'react-router-dom';

import NavigationBar from '../../components/NavigationBar';
import EpisodeAssistant from '../../containers/EpisodeAssistant/EpisodeAssistant';
import EpisodeEdit from '../../containers/EpisodeEdit';
import EpisodeNew from '../../containers/EpisodeNew';
import Home from '../../containers/Home';
import ListEpisodes from '../../containers/ListEpisodes';
import ListIntroOutro from '../../containers/ListIntroOutro';
import Login from '../../containers/Login';
import PodcastEdit from '../../containers/PodcastEdit';
import PodcastNew from '../../containers/PodcastNew';
import { UsersOverview, UsersInvite } from '../../containers/Users';

const Routing = () => {
  return (
    <Routes>
      <Route exact path="/" element={<NavigationBar />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/podcasts/new" element={<PodcastNew />} />
        <Route path="/podcasts/:podcastId/">
          <Route path="episodes">
            <Route index element={<ListEpisodes />} />
            <Route path="new" element={<EpisodeNew />} />
            <Route path=":episodeId/edit" element={<EpisodeEdit />} />
            <Route path=":episodeId/assistant" element={<EpisodeAssistant />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersOverview />} />
            <Route path="invite" element={<UsersInvite />} />
          </Route>
          <Route path="edit" element={<PodcastEdit />} />
          <Route path="intro-outro" element={<ListIntroOutro />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Routing;
