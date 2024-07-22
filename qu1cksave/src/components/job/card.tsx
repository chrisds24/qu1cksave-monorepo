'use client'

import { Job } from "@/types/job";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
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

    let salary = 'No salary info'
    const salaryMin = job.salary_min;
    const salaryMax = job.salary_max;
    // Checking for undefined since values could be 0
    //   UPDATE: Using null instead since a non-existent job.salary_min or max is null
    // Example: '$130000/yr - $160000/yr'
    if (salaryMin !== null || salaryMax !== null) {
      salary = `${salaryMin !== null ? `$${salaryMin}/yr`: 'N/A'} - ${salaryMax !== null ? `$${salaryMax}/yr`: 'N/A'}`
    }

    let cityAndState = 'No city and state'
    const city = job.city;
    const state = job.us_state
    if (city || state) {
      cityAndState = `${job.city ? job.city : 'N/A'}, ${job.us_state ? job.us_state : 'N/A'}`
    }

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
        <Typography color={(statusColor as any)[jobStatus]} fontWeight={'bold'} sx={{fontSize: '17px', display: {xs: 'flex', sm: 'none'}, marginBottom: 1}}>
          {`${job.job_status}`}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 1}}>
          <Box sx={{marginRight: 5, display: 'flex', flexDirection: {xs: 'column', sm: 'row'}}}>
            <Typography color='#ffffff' sx={{fontSize: '17px', marginRight: 1}}>
              {'Applied:'} 
            </Typography>
            <Typography color='#ce9178' sx={{fontSize: '17px'}}>
              {
                applied ?
                `${applied!.toLocaleString('default', { month: 'long' })} ${applied!.getDate()}, ${applied!.getFullYear()}` :
                'N/A'
              } 
            </Typography>                 
          </Box>
          <Box sx={{marginRight: {xs: 0, sm: 5}, display: 'flex', flexDirection: {xs: 'column', sm: 'row'}}}>
            <Typography color='#ffffff' sx={{fontSize: '17px', marginRight: 1}}>
              {'Posted:'} 
            </Typography>
            <Typography color='#ce9178' sx={{fontSize: '17px'}}>
              {
                posted ?
                `${posted!.toLocaleString('default', { month: 'long' })} ${posted!.getDate()}, ${posted!.getFullYear()}` :
                'N/A'
              } 
            </Typography>              
          </Box>
          <Typography color={(statusColor as any)[jobStatus]} fontWeight={'bold'} sx={{fontSize: '17px', display: {xs: 'none', sm: 'flex'}}}>
            {`${job.job_status}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
          <Typography color='#4fc1ff' fontWeight='bold' sx={{fontSize: '19px', width: {xs: '100%', sm: '60%'}, marginRight: 2, alignSelf: 'center'}}>
            {`${job.title}`}
          </Typography>
          <Box sx={{display: {xs: 'none', sm: 'flex'}, flexDirection: 'row', width: '40%', justifyContent: 'flex-end'}}>
            <Typography color='#6a9955' sx={{fontSize: '17px', alignSelf: 'center'}}>
              {salary}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{backgroundColor: '#ffffff', margin: '0px 15px', height: '95%', alignSelf: 'center'}} />
            <Typography color='#dcdcaa' sx={{fontSize: '17px', alignSelf: 'center'}}>
              {`${job.is_remote}`}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: {xs: 0, sm: 0.5}, width: '100%'}}>
          <Typography color='#4ec9b0' fontWeight={'bold'} sx={{fontSize: '17px', fontStyle: 'italic', marginRight: 2, alignSelf: 'center'}}>
            {`${job.company_name}`}
          </Typography>
          <Typography color='#ffffff' sx={{fontSize: '17px', fontStyle: 'italic', marginRight: 2, alignSelf: 'center', display: {xs: 'none', sm: 'flex'}}}>
            {job.country ? `${job.country}` : 'No country'}
          </Typography>
          <Typography color='#ffffff' sx={{fontSize: '17px', fontStyle: 'italic', alignSelf: 'center', display: {xs: 'none', sm: 'flex'}}}>
            {cityAndState}
          </Typography>
        </Box>
        <Box sx={{ display: {xs: 'flex', sm: 'none'}, flexDirection: 'column', width: '100%'}}>
          <Typography color='#ffffff' sx={{fontSize: '17px', fontStyle: 'italic'}}>
            {job.country ? `${job.country}` : 'No country'}
          </Typography>
          <Typography color='#ffffff' sx={{fontSize: '17px', fontStyle: 'italic'}}>
            {cityAndState}
          </Typography>
        </Box>
        <Box sx={{display: {xs: 'flex', sm: 'none'}, flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingBottom: 0.5}}>
          <Typography color='#6a9955' sx={{fontSize: '17px', marginRight: 2}}>
            {salary}
          </Typography>
          <Typography color='#dcdcaa' sx={{fontSize: '17px'}}>
            {`${job.is_remote}`}
          </Typography>
        </Box>
        <Box sx={{width: '70vw'}}>
          <Typography sx={{textOverflow: 'ellipsis', paddingBottom: 1, width: '100%'}} noWrap>
            {job.job_description ? job.job_description : 'No description'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, justifyContent: 'space-between', width: '100%'}}>
          <Box sx={{marginRight: 5, alignSelf: {xs: 'flex-start', sm: 'center'}, marginBottom: {xs: 1, sm: 0}}}>
            <Typography display={'inline'} color='#ffffff' sx={{fontSize: '17px', marginRight: 1, alignSelf: 'center'}}>
              {'From:'}
            </Typography>
            <Typography display={'inline'} color='#ce9178' sx={{fontSize: '17px', alignSelf: 'center'}}>
              {job.found_from ? job.found_from: 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignSelf: {xs: 'flex-end', sm: 'center'}}}>
            <Button
              variant="contained"
              sx={{
                color: '#ffffff',
                backgroundColor: '#000000',
                marginRight: 1,
                '&:hover': {
                  backgroundColor: '#0b0b0b',
                },
                width: '64px',
                height: '36px'
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
              sx={{
                color: '#ffffff',
                width: '64px',
                height: '36px'
              }}
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