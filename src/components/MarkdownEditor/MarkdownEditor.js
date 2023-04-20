import MDEditor, { commands } from '@uiw/react-md-editor';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

const MarkdownEditor = ({ id, name, value, height, onChange }) => {
  const [t] = useTranslation();

  commands.bold.buttonProps = {
    'aria-label': t('Upload.form.description.editor.bold'),
    title: t('Upload.form.description.editor.bold'),
  };

  commands.italic.buttonProps = {
    'aria-label': t('Upload.form.description.editor.italic'),
    title: t('Upload.form.description.editor.italic'),
  };

  commands.title1.icon = (
    <div style={{ fontSize: 18, textAlign: 'left' }}>
      {t('Upload.form.description.editor.title', { number: 1 })}
    </div>
  );

  commands.title2.icon = (
    <div style={{ fontSize: 16, textAlign: 'left' }}>
      {t('Upload.form.description.editor.title', { number: 2 })}
    </div>
  );

  commands.title3.icon = (
    <div style={{ fontSize: 15, textAlign: 'left' }}>
      {t('Upload.form.description.editor.title', { number: 3 })}
    </div>
  );

  commands.title4.icon = (
    <div style={{ fontSize: 14, textAlign: 'left' }}>
      {t('Upload.form.description.editor.title', { number: 4 })}
    </div>
  );

  commands.title5.icon = (
    <div style={{ fontSize: 13, textAlign: 'left' }}>
      {t('Upload.form.description.editor.title', { number: 5 })}
    </div>
  );

  commands.title6.icon = (
    <div style={{ fontSize: 12, textAlign: 'left' }}>
      {t('Upload.form.description.editor.title', { number: 6 })}
    </div>
  );

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
      height={height ? `${height}px` : undefined}
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
  height: PropTypes.number,
  onChange: PropTypes.func,
};

export default MarkdownEditor;
