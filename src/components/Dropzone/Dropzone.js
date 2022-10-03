import React, { Component } from 'react';
import { Box } from '@mui/material';

class Dropzone extends Component {
  constructor(props) {
    super(props);
    this.state = { hightlight: false };
    this.fileInputRef = React.createRef();

    this.handleOpenFileDialog = this.handleOpenFileDialog.bind(this);
    this.handleFilesAdded = this.handleFilesAdded.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  handleOpenFileDialog() {
    if (this.props.disabled) return;
    this.fileInputRef.current.click();
  }

  handleFilesAdded(evt) {
    if (this.props.disabled) return;
    const { files } = evt.target;
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files);
      this.props.onFilesAdded(array);
    }
  }

  handleDragOver(evt) {
    evt.preventDefault();

    if (this.props.disabled) return;

    this.setState({ hightlight: true });
  }

  handleDragLeave() {
    this.setState({ hightlight: false });
  }

  handleDrop(event) {
    event.preventDefault();

    if (this.props.disabled) return;

    const { files } = event.dataTransfer;
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files);
      this.props.onFilesAdded(array);
    }
    this.setState({ hightlight: false });
  }

  fileListToArray(list) {
    const array = [];
    for (let i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
  }

  render() {
    return (
      <Box
        sx={{
          height: '200px',
          width: '200px',
          backgroundColor: this.state.hightlight ? 'action.hover' : '',
          border: 2,
          borderColor: 'text.secondary',
          borderRadius: '50%',
          borderStyle: 'dashed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontSize: 4,
          cursor: this.props.disabled ? 'default' : 'pointer',
        }}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
        onClick={this.handleOpenFileDialog}
      >
        <Box
          component="input"
          ref={this.fileInputRef}
          sx={{ display: 'none' }}
          type="file"
          accept={this.props.accept}
          multiple={this.props.multiple || false}
          onChange={this.handleFilesAdded}
        />
        {this.props.children}
      </Box>
    );
  }
}

export default Dropzone;
