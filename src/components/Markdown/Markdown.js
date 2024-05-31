import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { Box, Link, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ReactMarkdown from 'react-markdown';

const Markdown = ({ text, truncateLength }) => {
  const [t] = useTranslation();
  const [isReadMore, setIsReadMore] = useState(false);

  const truncateString = (string, length) => {
    //trim the string to the maximum length
    var trimmedString = string.substr(0, length);

    //re-trim if we are in the middle of a word
    return trimmedString.substr(
      0,
      Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')),
    );
  };

  return (
    <>
      <ReactMarkdown
        children={isReadMore ? text : truncateString(text, truncateLength)}
        linkTarget="_blank"
        components={{
          img: ({ alt, src, title }) => {
            return (
              <Box
                component={LazyLoadImage}
                sx={{ width: '100%' }}
                src={src}
                title={title}
                alt={alt}
              />
            );
          },
          a: ({ children, href, target, title }) => {
            return (
              <Link href={href} target={target} title={title}>
                {children}
              </Link>
            );
          },
          p: ({ children }) => {
            return (
              <Typography variant="body1" marginBottom={2}>
                {children}
              </Typography>
            );
          },
          h1: ({ children }) => {
            return <Typography variant="h1">{children}</Typography>;
          },
          h2: ({ children }) => {
            return <Typography variant="h2">{children}</Typography>;
          },
          h3: ({ children }) => {
            return <Typography variant="h3">{children}</Typography>;
          },
          h4: ({ children }) => {
            return <Typography variant="h4">{children}</Typography>;
          },
          h5: ({ children }) => {
            return <Typography variant="h5">{children}</Typography>;
          },
        }}
      />
      <Button
        size="small"
        onClick={() => setIsReadMore(!isReadMore)}
        startIcon={isReadMore ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      >
        {isReadMore ? t('Markdown.showLess') : t('Markdown.showMore')}
      </Button>
    </>
  );
};

Markdown.propTypes = {
  /**
   * The markdown text to be rendered
   */
  text: PropTypes.string.isRequired,

  /**
   * If set, the length to which to trim down the text.
   * It also displays a more button that allows to display the full text.
   * */
  truncateLength: PropTypes.number,
};

export default Markdown;
