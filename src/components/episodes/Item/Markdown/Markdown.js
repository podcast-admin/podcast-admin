import React from 'react';
import ReactMarkdown from 'react-markdown';
import LazyLoad from 'react-lazyload';
import { Box, Link, Typography } from '@mui/material';

const Markdown = ({ children }) => {
  return (
    <ReactMarkdown
      children={children}
      linkTarget="_blank"
      components={{
        img: ({ alt, src, title }) => {
          return (
            <LazyLoad>
              <Box
                component="img"
                sx={{ width: '100%' }}
                src={src}
                title={title}
                alt={alt}
              />
            </LazyLoad>
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
  );
};

export default Markdown;
