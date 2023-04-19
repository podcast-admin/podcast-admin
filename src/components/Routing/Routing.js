import React from 'react';
import { Routes, Route } from 'react-router-dom';

import NavigationBar from '../../components/NavigationBar';
import Upload from '../../components/upload';
import ListEpisodes from '../../containers/ListEpisodes';
import ListIntroOutro from '../../containers/ListIntroOutro';
import EpisodeEdit from '../../containers/EpisodeEdit';
import PodcastEdit from '../../containers/PodcastEdit';
import PodcastNew from '../../containers/PodcastNew';
import Login from '../../containers/Login';
import Home from '../../containers/Home';
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
            <Route path="new" element={<Upload />} />
            <Route path=":episodeId/edit" element={<EpisodeEdit />} />
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
