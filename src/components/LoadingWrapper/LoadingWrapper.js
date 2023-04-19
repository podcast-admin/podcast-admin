import PropTypes from 'prop-types';
import { CircularProgress, Typography } from '@mui/material';

const LoadingWrapper = ({
  children,
  isLoading = true,
  isSuccess = false,
  isError = false,
  error = {},
}) => {
  if (isLoading) {
    return <CircularProgress />;
  } else if (isSuccess) {
    return children;
  } else if (isError) {
    return <Typography>Loading Error</Typography>;
  }
};

LoadingWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  isSuccess: PropTypes.bool,
  isError: PropTypes.bool,
};

export default LoadingWrapper;
