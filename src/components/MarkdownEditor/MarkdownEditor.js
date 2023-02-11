import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import MDEditor, { commands } from '@uiw/react-md-editor';

const MarkdownEditor = ({ id, name, value, onChange }) => {
  const [t] = useTranslation();

  commands.bold.buttonProps = {
    'aria-label': t('Upload.form.description.editor.bold'),
    title: t('Upload.form.description.editor.bold'),
  };

  commands.italic.buttonProps = {
    'aria-label': t('Upload.form.description.editor.italic'),
    title: t('Upload.form.description.editor.italic'),
  };

  commands.unorderedListCommand.buttonProps = {
    'aria-label': t('Upload.form.description.editor.unorderedListCommand'),
    title: t('Upload.form.description.editor.unorderedListCommand'),
  };

  commands.orderedListCommand.buttonProps = {
    'aria-label': t('Upload.form.description.editor.orderedListCommand'),
    title: t('Upload.form.description.editor.orderedListCommand'),
  };

  commands.link.buttonProps = {
    'aria-label': t('Upload.form.description.editor.link'),
    title: t('Upload.form.description.editor.link'),
  };

  commands.image.buttonProps = {
    'aria-label': t('Upload.form.description.editor.image'),
    title: t('Upload.form.description.editor.image'),
  };

  commands.hr.buttonProps = {
    'aria-label': t('Upload.form.description.editor.hr'),
    title: t('Upload.form.description.editor.hr'),
  };

  return (
    <MDEditor
      id={id}
      textareaProps={{ name }}
      name={name}
      value={value}
      onChange={onChange}
      commands={[
        commands.bold,
        commands.italic,
        commands.group(
          [
            commands.title1,
            commands.title2,
            commands.title3,
            commands.title4,
            commands.title5,
            commands.title6,
          ],
          {
            name: 'title',
            groupName: 'title',
            buttonProps: {
              'aria-label': t('Upload.form.description.editor.titleGroup'),
              title: t('Upload.form.description.editor.titleGroup'),
            },
          },
        ),
        commands.divider,
        commands.unorderedListCommand,
        commands.orderedListCommand,
        commands.divider,
        commands.link,
        commands.image,
        commands.hr,
      ]}
    />
  );
};

MarkdownEditor.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default MarkdownEditor;
