import { render } from '../../helpers/test-helpers';
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

const mockCopyToClipboard = jest.fn().mockImplementation(() => <div />);
jest.mock('react-copy-to-clipboard', () => ({
  ...jest.requireActual('react-router-dom'),
  CopyToClipboard: (props) => mockCopyToClipboard(props),
}));

describe('Given a podcastId', () => {
  it('should allow users to copy feed URL to clipboard', () => {
    render(<ListEpisodes />);

    expect(mockCopyToClipboard.mock.calls[0][0].text).toBe(
      'https://podcast-admin.firebaseapp.com/feed/some-podcast-id',
    );
  });
});
