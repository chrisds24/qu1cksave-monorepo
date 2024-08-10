import React from 'react';

import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { Stack } from '@mui/material';
import { Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import CopyrightIcon from '@mui/icons-material/Copyright';

export default function Footer() {
  return (
    <Box
      id={'footer'}
      sx={{
        width: '100vw',
        padding: {xs: '2vh 3.5vw 2vh 2.5vw', lg: '2vh 5vw 2vh 5vw'},
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: {xs: 'column', md: 'row'},
        justifyContent: 'space-between'
      }}
    >
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: {xs: '10px', md: '0px'}}}>
          <CopyrightIcon sx={{color: '#707477', height:'13px'}} />
          <Typography color='#707477' sx={{fontSize: '15px', paddingLeft: '3px'}}>
            2024 qu1cksave
          </Typography>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <Typography color='#707477' sx={{fontSize: '15px', paddingRight: '10px'}}>
            Contact:
          </Typography>
          <Stack direction="row" spacing={1}>
            <Link href={'https://github.com/chrisds24'} rel="noopener noreferrer" target="_blank">
                <GitHubIcon fontSize={'medium'} sx={{ color: '#707477'}} />
            </Link>         
          </Stack>
        </Box>
    </Box>
  );
}