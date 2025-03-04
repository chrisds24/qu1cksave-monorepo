'use client'

import { Box, Button, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { Job } from "@/types/job";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddOrEditDialog from "@/components/addOrEditDialog";
import DeleteDialog from "@/components/deleteDialog";
import FileDownloadSection from "@/components/fileDownloadSection";
import SingleJobSkeleton from "@/components/skeleton/singleJobSkeleton";
import { JobsContext } from "@/contexts/JobsContext";
import { SetIsAddContext } from "@/contexts/add_or_edit_dialog/IsAddContext";
import { SetOpenContext } from "@/contexts/add_or_edit_dialog/OpenContext";
import { SetDialogJobContext } from "@/contexts/add_or_edit_dialog/DialogJobContext";
import { SetDeleteJobIdContext } from "@/contexts/delete_dialog/DeleteJobIdContext";
import { SetDeleteJobOpenContext } from "@/contexts/delete_dialog/DeleteJobOpenContext";
import { JobsLoadingContext } from "@/contexts/JobsLoadingContext";

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
  const jobs = useContext(JobsContext);
  const setIsAdd = useContext(SetIsAddContext);
  const setOpen = useContext(SetOpenContext);
  const setDialogJob = useContext(SetDialogJobContext);
  const setDeleteJobId = useContext(SetDeleteJobIdContext);
  const setDeleteJobOpen = useContext(SetDeleteJobOpenContext);
  const jobsLoading = useContext(JobsLoadingContext);

  if (!jobsLoading) {
    if (jobs !== undefined) {
      // Not to be confused with the filteredJobs state (where we apply the filters to)
      const filteredJobs = (jobs as Job[]).filter((job) => job.id === params.id);
      const job = filteredJobs.length === 1 ? filteredJobs[0] : undefined;
  
      // WARNING !!! Reason why I didn't use getSignedUrl:
      //   Putting the signedUrl returned by getSignedUrl into the download button
      //   shows the credentials on hover.
      // UPDATE: It only shows the access key, which is not a security risk as long
      //   as the secret key isn't exposed.
      // - https://stackoverflow.com/questions/57539514/presigned-url-for-private-s3-bucket-displays-aws-access-key-id-and-bucket-name
      // - https://stackoverflow.com/questions/57692006/how-can-i-hide-my-access-key-in-pre-signed-url-by-aws-s3-using-python
      // - https://stackoverflow.com/questions/7678835/how-secure-are-amazon-aws-access-keys/7684662#7684662
  
      if (job) {
        const dateApplied = job.date_applied;
        const applied = dateApplied ? new Date(dateApplied.year, dateApplied.month, dateApplied.date) : undefined;
  
        const datePosted = job.date_posted;
        const posted = datePosted ? new Date(datePosted.year, datePosted.month, datePosted.date) : undefined;
  
        const dateSaved = job.date_saved;
        const saved = dateSaved ? new Date(dateSaved) : undefined;
  
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
  
        const paragraphs = job.job_description ? job.job_description.split(/\r\n|\r|\n/) : [];
        const notesParagraphs = job.notes ? job.notes.split(/\r\n|\r|\n/) : [];
  
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column'}}>
            <AddOrEditDialog />
            <DeleteDialog />
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1.5}}>
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
                  onClick={
                    () =>  {
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
            <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, justifyContent: 'space-between', marginBottom: {xs: 1, md: 0}}}>
              <Box sx={{marginRight: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
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
              <Box sx={{marginRight: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
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
              <Box sx={{marginRight: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                <Typography color='#ffffff' sx={{fontSize: '17px', marginRight: 1}}>
                  {'Saved:'} 
                </Typography>
                <Typography color='#ce9178' sx={{fontSize: '17px'}}>
                  {
                    saved ?
                    `${saved!.toLocaleString('default', { month: 'long' })} ${saved!.getDate()}, ${saved!.getFullYear()}` :
                    'N/A'
                  } 
                </Typography>              
              </Box>
            </Box>
            <Box sx={{marginBottom: 1.5}}>
              <Typography display={'inline'} color='#ffffff' sx={{fontSize: '17px', marginRight: 1, fontWeight: 'bold'}}>
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
            <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}}}>
              <Typography color='#dcdcaa' sx={{fontSize: '20px'}}>
                {`${job.is_remote}`}
              </Typography>
              {/* <HorizontalRuleIcon sx={{color: '#ffffff', margin: '0vw 1vw', alignSelf: 'center'}} /> */}
              <Divider orientation="vertical" flexItem sx={{backgroundColor: '#ffffff', margin: '0px 15px', height: '20px', alignSelf: 'center', display: {xs: 'none', sm: 'flex'}}} />
              <Typography color='#6a9955' sx={{fontSize: '20px'}}>
                {salary}
              </Typography>
            </Box>
            <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}}}>
              <Typography color='#ffffff' sx={{fontSize: '17px'}}>
                {cityAndState}
              </Typography>
              {/* <HorizontalRuleIcon sx={{color: '#ffffff', margin: '0vw 1vw'}} /> */}
              <Divider orientation="vertical" flexItem sx={{display: {xs: 'none', sm: 'flex'}, backgroundColor: '#ffffff', margin: '0px 15px', height: '17px', alignSelf: 'center'}} />
              <Typography color='#ffffff' sx={{fontSize: '17px'}}>
                {job.country ? `${job.country}` : 'No country'}
              </Typography>
            </Box>
            <Divider sx={{ backgroundColor: '#808080', marginTop: 2, marginBottom: 2}} />
            <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginBottom: 1}}>
              {'Description'}
            </Typography>
            {/*
              Note: I'm fine using idx as key here since I want to re-render
              the whole thing anyway if paragraphs changes (In other words,
              the description of the job changes). If it doesn't change, then
              the description's paragraphs would retain the same order and
              that shouldn't be a problem.
            */}
            { paragraphs.length > 0 ?
              paragraphs.map((paragraph, idx) => 
                paragraph ?
                <Typography key={`Description Paragraph ${idx}`} color='#ffffff' sx={{fontSize: '17px'}}>
                  {paragraph}
                </Typography>
                :
                // To deal with double line breaks \n\n in strings. Example:
                // Lorem ipsum\n\nBlah blah    is actually:
                // 'Lorem ipsum
                //
                //  Blah blah'
                // When we split, we get ['Lorem ipsum', '', 'Blah blah']
                // So we want the '', to be a line break just as originally intended
                // 
                <br key={`Description Paragraph Line Break ${idx}`} />
              )
              :
              <Typography color='#ffffff' sx={{fontSize: '17px'}}>
                {'N/A'}
              </Typography>       
            }
            <Divider sx={{ backgroundColor: '#808080', marginTop: 2, marginBottom: 2}} />
            <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginBottom: 1}}>
              {'Notes'}
            </Typography>
            {/* Note: Same idea as paragraphs regarding idx as key */}
            { notesParagraphs.length > 0 ?
              notesParagraphs.map((paragraph, idx) => 
                paragraph ?
                <Typography key={`Notes Paragraph ${idx}`} color='#ffffff' sx={{fontSize: '17px'}}>
                  {paragraph}
                </Typography>
                :
                <br key={`Notes Paragraph Line Break ${idx}`}/>
              )
              :
              <Typography color='#ffffff' sx={{fontSize: '17px'}}>
                {'N/A'}
              </Typography> 
            }
            <Divider sx={{ backgroundColor: '#808080', marginTop: 2, marginBottom: 2}} />
            <Box sx={{maxWidth: '80vw'}}>
              <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginBottom: 1}}>
                {'Links'}
              </Typography>
              {job.links && job.links.length > 0 ?
                <List sx={{padding: '0px 0px 0px 0px'}}>
                  {/* Note: Same idea as paragraphs regarding idx as key */}
                  {job.links.map((link, idx) =>
                    <ListItem
                      key={`Link ${idx}`}
                      component='a'
                      href={`${link}`}
                      rel='noopener noreferrer'
                      target='_blank'
                      sx={{padding: '0px 0px 15px 0px', margin: 0}}
                    >
                      <ListItemText
                        primary={link}
                        sx={{ color: '#ffffff', textOverflow: 'ellipsis', margin: 0 }}
                        primaryTypographyProps={{ 
                          style: {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }
                        }}
                      />   
                    </ListItem>
                  )}
                </List>
                :
                <Typography color='#ffffff' sx={{fontSize: '17px', padding: '0px 0px 0px 0px'}}>
                  {'N/A'}
                </Typography> 
              }
            </Box>
  
            <Divider sx={{ backgroundColor: '#808080', marginTop: 2, marginBottom: 2}} />
  
            <Box sx={{display: 'flex', flexWrap: 'wrap', flexDirection: {xs: 'column', sm: 'row'}, marginBottom: 2}}>
              <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginRight: 1}}>
                {'Job posting found from:'} 
              </Typography>
              <Typography color='#ffffff' sx={{fontSize: '20px'}}>
                {job.found_from ? job.found_from : 'N/A'} 
              </Typography>                 
            </Box>
            <FileDownloadSection job={job} fileType={'resume'} />
            <Box sx={{marginBottom: 1}}/>
            <FileDownloadSection job={job} fileType={'cover_letter'} />
          </Box>
        );
      } else {
        return (
          <Box sx={{width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around'}}>
            <Box sx={{display: 'flex', height: '100%', width: '60%', flexDirection: 'row', alignItems: 'center'}}>
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography variant="h3" sx={{fontWeight: 'bold', color: '#ffffff'}}>
                  Oops. The selected job cannot be found.
                </Typography>
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
                    alignSelf: 'center'
                  }}
                  onClick={() => router.push('/jobs')}
                >
                  Back to Jobs
                </Button>
              </Box>
            </Box>
          </Box>
        );
      }
    } else {
      return (
        <Box sx={{width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around'}}>
          <Box sx={{display: 'flex', height: '100%', width: '60%', flexDirection: 'row', alignItems: 'center'}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <Typography variant="h3" sx={{fontWeight: 'bold', color: '#ffffff'}}>
                An error occured. Please try again later.
              </Typography>
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
                  alignSelf: 'center'
                }}
                onClick={() => router.push('/jobs')}
              >
                Back to Jobs
              </Button>
            </Box>
          </Box>
        </Box>
      );          
    }
  } else {
    return (
      <SingleJobSkeleton />
    );
  }
}