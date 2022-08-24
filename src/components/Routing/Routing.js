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
import { UsersOverview, UsersInvite } from '../../containers/Users';

const Routing = () => {
  return (
    <Routes>
      <Route exact path="/" element={<NavigationBar />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/podcasts/new" element={<PodcastNew />} />
        <Route path="/podcasts/:podcastId/">
<<<<<<< HEAD
          <Route path="episodes">
            <Route index element={<ListEpisodes />} />
            <Route path="new" element={<Upload />} />
            <Route path=":episodeId/edit" element={<EditEpisode />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersOverview />} />
=======
          <Route path="episodes/new" element={<Upload />} />
          <Route path="episodes/:episodeId/edit" element={<EditEpisode />} />
          <Route path="edit" element={<PodcastEdit />} />
          <Route path="episodes" element={<ListEpisodes />} />
          <Route path="intro-outro" element={<ListIntroOutro />} />
          <Route path="users">
            <Route index element={<UsersList />} />
>>>>>>> bb116b2 (Next iteration)
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
