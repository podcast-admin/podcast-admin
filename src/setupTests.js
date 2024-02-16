import '@testing-library/jest-dom';

jest.mock('react-markdown', () => (props) => {
  return <>{props.children}</>;
});
