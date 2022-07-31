import React, { Component } from 'react';
import Upload from '../../components/upload';
import withRouter from '../../helpers/WithRouter';

class EditEpisode extends Component {
  render() {
    const {
      params: { podcastId, episodeId },
    } = this.props;

    return <Upload podcastId={podcastId} episodeId={episodeId} />;
  }
}

export default withRouter(EditEpisode);
