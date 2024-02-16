import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

const wrapper = ({ children }) => {
  return <Router>{children}</Router>;
};

const customRender = (ui, options) => render(ui, { wrapper, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
