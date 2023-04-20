import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState, createRef } from 'react';

const Dropzone = ({
  children,
  disabled,
  accept,
  multiple,
  onFilesAdded,
  icon,
  label,
}) => {
  const [state, setState] = useState({ hightlight: false });
  const fileInputRef = createRef();

  const handleOpenFileDialog = () => {
    if (disabled) return;
    fileInputRef.current.click();
  };

  const handleFilesAdded = (evt) => {
    if (disabled) return;
    const { files } = evt.target;
    if (onFilesAdded) {
      const array = fileListToArray(files);
      onFilesAdded(array);
    }
  };

  const handleDragOver = (evt) => {
    evt.preventDefault();

    if (disabled) return;

    setState({ hightlight: true });
  };

  const handleDragLeave = () => {
    setState({ hightlight: false });
  };

  const handleDrop = (event) => {
    event.preventDefault();

    if (disabled) return;

    const { files } = event.dataTransfer;
    if (onFilesAdded) {
      const array = fileListToArray(files);
      onFilesAdded(array);
    }
    setState({ hightlight: false });
  };

  const fileListToArray = (list) => {
    const array = [];
    for (let i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
  };

  return (
    <Box
      sx={{
        height: '200px',
        width: '200px',
        backgroundColor: state.hightlight ? 'action.hover' : '',
        border: 2,
        borderColor: 'text.secondary',
        borderRadius: '50%',
        borderStyle: 'dashed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: disabled ? 'default' : 'pointer',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleOpenFileDialog}
    >
      <Box
        component="input"
        ref={fileInputRef}
        sx={{ display: 'none' }}
        type="file"
        accept={accept}
        multiple={multiple || false}
        onChange={handleFilesAdded}
      />
      {icon}
      <Typography>{label}</Typography>
      {children}
    </Box>
  );
};

Dropzone.propTypes = {
  children: PropTypes.array,
  icon: PropTypes.object,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  onFilesAdded: PropTypes.func.isRequired,
};

export default Dropzone;
