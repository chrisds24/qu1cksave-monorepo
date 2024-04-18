'use client'

import { Job } from "@/types/job";
import { Box, Button, Paper, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Applied, Not Applied, Assessment, Interview, Job Offered, Accepted Offer, Declined Offer
// Rejected, Ghosted, Closed
const statusColor = {
  'Applied': 'yellow',
  'Not Applied': 'orange',
  'Assessment': 'lime',
  'Interview': 'limegreen',
  'Job Offered': 'green',
  'Accepted Offer': 'gold',
  'Declined Offer': 'blue',
  'Rejected': 'red',
  'Ghosted': 'darkred',
  'Closed': 'gray'
};

export default function JobCard(props: any) {
  const job: Job | undefined = props.job;

  if (job) {
    const dateApplied = job.date_applied;
    const applied = dateApplied ? new Date(dateApplied.year, dateApplied.month, dateApplied.date) : undefined;

    const datePosted = job.date_posted;
    const posted = datePosted ? new Date(datePosted.year, datePosted.month, datePosted.date) : undefined;

    const jobStatus = job.job_status;

    return (
      <Paper
        sx={{
          backgroundColor: '#2d2d30',
          width: '100%',
          color: '#ffffff',
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            backgroundColor: '#171717'
          },
        }}
        elevation={3}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 1}}>
          <Box>
            <Typography display={'inline'} color='#ffffff' sx={{fontSize: '17px', marginRight: 1}}>
              {'Applied:'} 
            </Typography>
            <Typography display={'inline'} color='#ce9178' sx={{fontSize: '17px'}}>
              {
                applied ?
                `${applied!.toLocaleString('default', { month: 'long' })} ${applied!.getDate()}, ${applied!.getFullYear()}` :
                'N/A'
              } 
            </Typography>                 
          </Box>
          <Box>
            <Typography display={'inline'} color='#ffffff' sx={{fontSize: '17px', marginRight: 1}}>
              {'Posted:'} 
            </Typography>
            <Typography display={'inline'} color='#ce9178' sx={{fontSize: '17px'}}>
              {
                posted ?
                `${posted!.toLocaleString('default', { month: 'long' })} ${posted!.getDate()}, ${posted!.getFullYear()}` :
                'N/A'
              } 
            </Typography>              
          </Box>
          <Typography color={(statusColor as any)[jobStatus]} fontWeight={'bold'} sx={{fontSize: '17px'}}>
            {`${job.job_status}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Typography color='#4fc1ff' fontWeight='bold' sx={{fontSize: '19px'}}>
            {`${job.title}`}
          </Typography>
          <Typography color='#dcdcaa' sx={{fontSize: '17px'}}>
            {`${job.is_remote}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 0.5}}>
          <Typography color='#4ec9b0' fontWeight={'bold'} sx={{fontSize: '17px', fontStyle: 'italic'}}>
            {`${job.company_name}`}
          </Typography>
          <Typography color='#ffffff' sx={{fontSize: '17px', fontStyle: 'italic'}}>
            {job.country ? `${job.country}` : 'N/A'}
          </Typography>
          <Typography color='#ffffff' sx={{fontSize: '17px', fontStyle: 'italic'}}>
            {job.city ? `${job.city}, ${job.us_state}` : 'N/A'}
          </Typography>
        </Box>
        <Typography sx={{textOverflow: 'ellipsis', paddingBottom: 1}} noWrap>
          {job.job_description ? job.job_description : 'No description.'}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Box>
            <Typography display={'inline'} color='#ffffff' sx={{fontSize: '17px', marginRight: 1}} alignSelf={'center'}>
              {'From:'}
            </Typography>
            <Typography display={'inline'} color='#ce9178' sx={{fontSize: '17px'}} alignSelf={'center'}>
              {job.found_from ? job.found_from: 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row'}}>
            <Button
              variant="contained"
              sx={{
                color: '#ffffff',
                backgroundColor: '#000000',
                marginRight: 1,
                '&:hover': {
                  backgroundColor: '#0b0b0b',
                },
              }}
            >
              <EditIcon sx={{ color: '#ffffff'}} />
            </Button>
            <Button
              variant="contained"
              sx={{ color: '#ffffff' }}
              color='error'
            >
              <DeleteIcon sx={{ color: '#ffffff'}} />
            </Button>          
          </Box>
        </Box>
      </Paper>
    );
  }
}