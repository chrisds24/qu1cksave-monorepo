'use client'

import { Box, Button, Divider, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { JobsContext } from "../layout";
import { Job } from "@/types/job";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

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

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { jobs } = useContext(JobsContext);
  const filteredJobs = (jobs as Job[]).filter((job) => job.id === params.id);
  const job = filteredJobs.length == 1 ? filteredJobs[0] : undefined;

  if (job) {
    const dateApplied = job.date_applied;
    const applied = dateApplied ? new Date(dateApplied.year, dateApplied.month, dateApplied.date) : undefined;

    const datePosted = job.date_posted;
    const posted = datePosted ? new Date(datePosted.year, datePosted.month, datePosted.date) : undefined;

    const dateSaved = job.date_saved;
    const saved = dateSaved ? new Date(dateSaved) : undefined;

    const jobStatus = job.job_status;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 1.5}}>
          <ArrowBackIcon sx={{color: '#ffffff', cursor: 'pointer'}} onClick={() => router.push('/jobs')}/>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
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
              <EditIcon
                sx={{ color: '#ffffff'}}
                // TODO: Change this to go to edit mode instead
                onClick={() => router.push(`/jobs/${job.id}`)}
              />
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
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
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
          <Box>
            <Typography display={'inline'} color='#ffffff' sx={{fontSize: '17px', marginRight: 1}}>
              {'Saved:'} 
            </Typography>
            <Typography display={'inline'} color='#ce9178' sx={{fontSize: '17px'}}>
              {
                saved ?
                `${saved!.toLocaleString('default', { month: 'long' })} ${saved!.getDate()}, ${saved!.getFullYear()}` :
                'N/A'
              } 
            </Typography>              
          </Box>
        </Box>
        <Box sx={{paddingBottom: 1.5}}>
          <Typography display={'inline'} color='#ffffff' sx={{fontSize: '17px', marginRight: 1}}>
            {'Status:'} 
          </Typography>
          <Typography display={'inline'} color={(statusColor as any)[jobStatus]} fontWeight={'bold'} sx={{fontSize: '17px'}}>
            {`${job.job_status}`}
          </Typography>
        </Box>
        <Typography color='#4fc1ff' fontWeight='bold' sx={{fontSize: '24px'}}>
          {`${job.title}`}
        </Typography>
        <Typography color='#4ec9b0' fontWeight={'bold'} sx={{fontSize: '20px'}}>
          {`${job.company_name}`}
        </Typography>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
          <Typography color='#dcdcaa' sx={{fontSize: '20px'}}>
            {`${job.is_remote}`}
          </Typography>
          {/* <HorizontalRuleIcon sx={{color: '#ffffff', margin: '0vw 1vw', alignSelf: 'center'}} /> */}
          <Divider orientation="vertical" flexItem sx={{backgroundColor: '#ffffff', margin: '0vw 1vw', height: '20px', alignSelf: 'center'}} />
          <Typography color='#6a9955' sx={{fontSize: '20px'}}>
            {'$130000/yr - $160000/yr'} {/* Replace this with an actual salary */}
          </Typography>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
          <Typography color='#ffffff' sx={{fontSize: '17px'}}>
            {job.city ? `${job.city}, ${job.us_state}` : 'N/A'}
          </Typography>
          {/* <HorizontalRuleIcon sx={{color: '#ffffff', margin: '0vw 1vw'}} /> */}
          <Divider orientation="vertical" flexItem sx={{backgroundColor: '#ffffff', margin: '0vw 1vw', height: '17px', alignSelf: 'center'}} />
          <Typography color='#ffffff' sx={{fontSize: '17px'}}>
            {job.country ? `${job.country}` : 'N/A'}
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: '#808080', marginTop: 2, marginBottom: 2}} />

      </Box>
    );
  }
}