'use client'

import styles from './card.module.css';
import { Job } from "@/types/job";
import { Box, Divider, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from "next/navigation";
import { memo, useContext } from "react";
import { SetOpenContext } from "@/contexts/add_or_edit_dialog/OpenContext";
import { SetIsAddContext } from "@/contexts/add_or_edit_dialog/IsAddContext";
import { SetDialogJobContext } from "@/contexts/add_or_edit_dialog/DialogJobContext";
import { SetDeleteJobIdContext } from "@/contexts/delete_dialog/DeleteJobIdContext";
import { SetDeleteJobOpenContext } from "@/contexts/delete_dialog/DeleteJobOpenContext";

// Applied, Not Applied, Assessment, Interview, Job Offered, Accepted Offer, Declined Offer
// Rejected, Ghosted, Closed
const statusColor = {
  // Yellow
  'Applied': 'applied',
  'Assessment': 'assessment',
  'Interview': 'interview',

  // Green
  'Job Offered': 'job-offered',
  'Accepted Offer': 'accepted-offer',

  'Declined Offer': 'declined-offer', // Blue

  'Not Applied': 'not-applied', // Orange

  // Red
  'Rejected': 'rejected',
  'Ghosted': 'ghosted',

  'Closed': 'closed' // Gray
};
// const statusColor = {
//   // Yellow
//   'Applied': '#cccc00',
//   'Assessment': '#ffff00',
//   'Interview': '#ffff27',

//   // Green
//   'Job Offered': '#00cc00',
//   'Accepted Offer': '#00ff00',

//   'Declined Offer': '#6262ff', // Blue

//   'Not Applied': '#cc8400', // Orange

//   // Red
//   'Rejected': '#ff0000',
//   'Ghosted': '#b10000',

//   'Closed': '#808080' // Gray
// };

// Important: Using memo actually speeds things up by a lot. For example,
//   this is easily seen when there's a ton of jobs and the user has
//   jobsPerPage at maximum and they try to change sortBy and sortIncreasing.
// This is crucial since JobList doesn't have a children prop where JobCard
//   is wrapped by JobList. (Though, they still have a parent <-> child
//   relationship.)
// Note: By wrapping JobCard in memo, we have turned it into a pure component
//   since it only renders if its state or props have changed.
// export default function JobCard(props: any) {
export const JobCard = memo(function JobCard(props: any) {
  const job: Job | undefined = props.job;
  const router = useRouter();

  const setOpen = useContext(SetOpenContext);
  const setIsAdd = useContext(SetIsAddContext);
  const setDialogJob = useContext(SetDialogJobContext);
  const setDeleteJobId = useContext(SetDeleteJobIdContext);
  const setDeleteJobOpen = useContext(SetDeleteJobOpenContext);

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
      <div className={styles['card']} onClick={() => router.push(`/jobs/${job.id}`)}>
        {/* Status shows up on top below sm breakpoint */}
        <p className={`${styles['status']} ${(statusColor as any)[jobStatus]} ${styles['status-top']}`}>
          {`${job.job_status}`}
        </p>
        <div className={styles['date-and-status-container']}>
          <div className={styles['date-applied-container']}>
            <p className={styles['date-label']}>
              {'Applied:'} 
            </p>
            <p className="date-value-color">
              {
                applied ?
                `${applied!.toLocaleString('default', { month: 'long' })} ${applied!.getDate()}, ${applied!.getFullYear()}` :
                'N/A'
              } 
            </p>                 
          </div>
          <div className={styles['date-posted-container']}>
            <p className={styles['date-label']}>
              {'Posted:'} 
            </p>
            <p className="date-value-color">
              {
                posted ?
                `${posted!.toLocaleString('default', { month: 'long' })} ${posted!.getDate()}, ${posted!.getFullYear()}` :
                'N/A'
              } 
            </p>              
          </div>
          <p className={`${styles['status']} ${(statusColor as any)[jobStatus]} ${styles['status-row']}`}>
            {`${job.job_status}`}
          </p>
        </div>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
          <Typography color='#4fc1ff' fontWeight='bold' sx={{fontSize: '19px', width: {xs: '100%', sm: '60%'}, marginRight: 2, alignSelf: 'center'}}>
            {`${job.title}`}
          </Typography>
          <Box sx={{width: '40%', display: {xs: 'none', sm: 'flex'}, justifyContent: 'flex-end'}}>
            <Box sx={{display: 'flex', flexDirection: 'row', maxHeight: '90px', alignSelf: 'center'}}>
              {salaryMin === null && salaryMax === null ?
                <Typography color='#6a9955' sx={{fontSize: '17px', alignSelf: 'center'}}>
                  {'No salary info'}
                </Typography> :
                <Box sx={{display: 'flex', alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'end'}}>
                  <Typography color='#6a9955' sx={{fontSize: '17px'}}>
                    {`${salaryMin !== null ? `$${salaryMin}/yr`: 'N/A'}`}
                  </Typography>
                  <Typography color='#6a9955' sx={{fontSize: '17px', marginLeft: 0.5, marginRight: 0.5}}>
                    {`-`}
                  </Typography>
                  <Typography color='#6a9955' sx={{fontSize: '17px'}}>
                    {`${salaryMax !== null ? `$${salaryMax}/yr`: 'N/A'}`}
                  </Typography>
                </Box>
              }
              <Divider orientation="vertical" flexItem sx={{backgroundColor: '#ffffff', margin: '0px 15px'}} />
              <Typography color='#dcdcaa' sx={{fontSize: '17px', alignSelf: 'center'}}>
                {`${job.is_remote}`}
              </Typography>
            </Box>
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
            <button
              className="btn-1 mr-8px"
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
            </button>
            <button
              className="btn-1 mr-8px btn-err"
              onClick={
                (event) =>  {
                  event.stopPropagation();
                  setDeleteJobId(job.id);
                  setDeleteJobOpen(true);            
                }
              }
            >
              <DeleteIcon sx={{ color: '#ffffff'}} />
            </button>          
          </Box>
        </Box>
      </div>
    );
  }
// };
});