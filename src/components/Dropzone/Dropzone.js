import React, { useState } from 'react';

import { Box } from '@mui/material';

const Dropzone = (props) => {
  const { disabled, onFilesAdded, accept, multiple, children, sx } = props;
  const [state, setState] = useState({ highlight: false });
  const fileInputRef = React.createRef();

  const handleOpenFileDialog = () => {
    if (props.disabled) return;
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

    setState({ highlight: true });
  };

  const handleDragLeave = () => {
    setState({ highlight: false });
  };

  const handleDrop = (event) => {
    event.preventDefault();

    if (disabled) return;

    const { files } = event.dataTransfer;
    if (onFilesAdded) {
      const array = fileListToArray(files);
      onFilesAdded(array);
    }
    setState({ highlight: false });
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
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleOpenFileDialog}
      sx={{
        cursor: disabled ? 'default' : 'pointer',
        backgroundColor: state.highlight ? 'grey.50' : 'common.white',

        height: '200px',
        width: '200px',
        border: state.highlight ? '4px dashed' : '2px dashed',
        borderColor: state.highlight ? 'primary.main' : 'grey.300',
        borderRadius: '10%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontSize: '16px',
        ...sx,
      }}
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
      {children}
    </Box>
  );
};

export default Dropzone;
