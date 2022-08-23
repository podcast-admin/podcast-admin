import React from 'react';
import { Routes, Route } from 'react-router-dom';

import NavigationBar from '../../components/NavigationBar';
import Upload from '../../components/upload';
import ListEpisodes from '../../containers/ListEpisodes';
import ListIntroOutro from '../../containers/ListIntroOutro';
import EditEpisode from '../../containers/EditEpisode';
import PodcastEdit from '../../containers/PodcastEdit';
import PodcastNew from '../../containers/PodcastNew';
import Login from '../../containers/Login';
import Home from '../../containers/Home';
import Users from '../../containers/Users';

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<NavigationBar />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="podcasts">
          <Route path="new" element={<PodcastNew />} />
          <Route path=":podcastId">
            <Route path="episodes">
              <Route index element={<ListEpisodes />} />
              <Route path="new" element={<Upload />} />
              <Route path=":episodeId/edit" element={<EditEpisode />} />
            </Route>
            <Route path="edit" element={<PodcastEdit />} />
            <Route path="intro-outro" element={<ListIntroOutro />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default Routing;
