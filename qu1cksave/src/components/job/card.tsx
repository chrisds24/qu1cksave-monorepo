'use client'

import { Job } from "@/types/job";
import { Box, Button, Paper, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { JobsContext } from "@/app/(main)/jobs/layout";

// Applied, Not Applied, Assessment, Interview, Job Offered, Accepted Offer, Declined Offer
// Rejected, Ghosted, Closed
const statusColor = {
  // Yellow
  'Applied': '#cccc00',
  'Assessment': '#ffff00',
  'Interview': '#ffff27',

  // Green
  'Job Offered': '#00cc00',
  'Accepted Offer': '#00ff00',

  'Declined Offer': '#6262ff', // Blue

  'Not Applied': '#cc8400', // Orange

  // Red
  'Rejected': '#ff0000',
  'Ghosted': '#b10000',

  'Closed': '#808080' // Gray
};

export default function JobCard(props: any) {
  const job: Job | undefined = props.job;
  const router = useRouter();

  const {setOpen, setIsAdd, setDialogJob, setDeleteJobId, setDeleteJobOpen} = useContext(JobsContext);

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
          cursor: 'pointer'
        }}
        elevation={3}
        onClick={() => router.push(`/jobs/${job.id}`)}
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
            {`${job.city ? job.city : 'N/A'}, ${job.us_state ? job.us_state : 'N/A'}`}
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
              onClick={
                (event) =>  {
                  event.stopPropagation();
                  setIsAdd(false);
                  setDialogJob(job);
                  setOpen(true);
                }
              }
            >
              <EditIcon
                sx={{ color: '#ffffff'}}
              />
            </Button>
            <Button
              variant="contained"
              sx={{ color: '#ffffff' }}
              color='error'
              onClick={
                (event) =>  {
                  event.stopPropagation();
                  setDeleteJobId(job.id);
                  setDeleteJobOpen(true);            
                }
              }
            >
              <DeleteIcon sx={{ color: '#ffffff'}} />
            </Button>          
          </Box>
        </Box>
      </Paper>
    );
  }
}