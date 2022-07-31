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
      <Route exact path="/" element={<NavigationBar />}>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/podcasts/new" element={<PodcastNew />} />
        <Route path="/podcasts/:podcastId/">
          <Route path="episodes/new" element={<Upload />} />
          <Route path="episodes/:episodeId/edit" element={<EditEpisode />} />
          <Route path="edit" element={<PodcastEdit />} />
          <Route path="episodes" element={<ListEpisodes />} />
          <Route path="intro-outro" element={<ListIntroOutro />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Routing;
