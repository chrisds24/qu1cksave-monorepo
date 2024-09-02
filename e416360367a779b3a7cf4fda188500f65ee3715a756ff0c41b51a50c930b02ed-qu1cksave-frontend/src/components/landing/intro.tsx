import { Box, Button, Link, Typography } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Intro() {
  return (
    <Box
      sx={{
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '100px',
        paddingLeft: {xs: '2.5vw', lg: '5vw'},
        paddingRight: {xs: '2.5vw', lg: '5vw'},
        alignItems: 'center',
        paddingBottom: '40px'
      }}
    >
      <Typography
        variant='h2'
        sx={{
          color: '#ffffff',
          marginTop: '60px',
          fontWeight: 'bold',
          paddingLeft: {xs: '5%', md: '5%'},
          paddingRight: {xs: '5%', md: '5%'},
        }}>
        A simpler and more efficient job search.
      </Typography>
      <Typography
        variant='subtitle1'
        sx={{
          color: '#707477',
          fontSize: '25px',
          marginTop: '25px',
          paddingLeft: {xs: '5%', md: '2.5%'},
          paddingRight: {xs: '5%', md: '2.5%'},
        }}>
        Track your job applications along with their associated resumes and cover letters all in one place.
        Seamlessly search through them using advanced filters.
      </Typography>
      <Link href="/signup">
        <Button
          sx={{
            backgroundColor: '#ffffff',
            color: '#000000',
            padding: '10px 15px',
            '&:hover': {
              backgroundColor: '#4b4e50',
              color: '#ffffff'
            },
            marginTop: '25px',
            borderRadius: '40px'
          }}
        >
          Get Started&nbsp;
          <ArrowForwardIcon />
        </Button>
      </Link>
    </Box>
  );
}