import { Container, Paper, Typography } from '@mui/material';

const PageContainer = ({ title, children }) => (
  <Container
    maxWidth="lg"
    sx={{
      padding: 4,
    }}
  >
    {title && (
      <Typography variant="h3" gutterBottom>
        {title}
      </Typography>
    )}
    <Paper sx={{ padding: 2 }}>{children}</Paper>
  </Container>
);

export default PageContainer;
