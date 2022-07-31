import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import enableHooks from 'jest-react-hooks-shallow';

Enzyme.configure({ adapter: new Adapter() });
enableHooks(jest);

jest.mock('react-markdown', () => (props) => {
  return <>{props.children}</>;
});
