import { shallow } from 'enzyme';
import ListEpisodes from './';

jest.mock('../../helpers/WithAuth', () => (Component) => (props) => (
  <Component {...props} />
));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    podcastId: 'some-podcast-id',
  }),
}));

describe('Given a podcastId', () => {
  it('should allow users uto copy feed URL to clipboard', () => {
    const wrapper = shallow(<ListEpisodes />)
      .find('ListEpisodes')
      .dive();
    expect(
      wrapper.find('CopyToClipboard').find({
        text: 'https://podcast-admin.firebaseapp.com/feed/some-podcast-id',
      }),
    ).toHaveLength(1);
  });
});
