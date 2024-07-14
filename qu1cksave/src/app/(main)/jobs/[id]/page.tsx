'use client'

import { Box, Button, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { JobsContext } from "../layout";
import { Job } from "@/types/job";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddOrEditDialog from "@/components/addOrEditDialog";
import { Resume } from "@/types/resume";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteDialog from "@/components/deleteDialog";

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
  const { jobs, setIsAdd, setOpen, setDialogJob, setJobs, setDeleteJobId, setDeleteJobOpen } = useContext(JobsContext);
  // Not to be confused with the filteredJobs state (where we apply the filters to)
  const filteredJobs = (jobs as Job[]).filter((job) => job.id === params.id);
  const job = filteredJobs.length == 1 ? filteredJobs[0] : undefined;

  // WARNING !!! Reason why I didn't use getSignedUrl:
  //   Putting the signedUrl returned by getSignedUrl into the download button
  //   shows the credentials on hover.
  // UPDATE: It only shows the access key, which is not a security risk as long
  //   as the secret key isn't exposed.
  // - https://stackoverflow.com/questions/57539514/presigned-url-for-private-s3-bucket-displays-aws-access-key-id-and-bucket-name
  // - https://stackoverflow.com/questions/57692006/how-can-i-hide-my-access-key-in-pre-signed-url-by-aws-s3-using-python
  // - https://stackoverflow.com/questions/7678835/how-secure-are-amazon-aws-access-keys/7684662#7684662

  const downloadResume = async (resume: Resume, target: any) => {
    // IMPORTANT: One issue with the "caching" in state is that it will use a lot of RAM.
    // IMPORTANT: Also, I noticed that the blob stays in memory even without storing
    //   it in state (gone after refresh). How do I clear this out?
    // Alternatives
    //   IndexedDB
    //   - https://stackoverflow.com/questions/55353250/what-is-considered-too-much-data-in-react-state

    target.disabled = true;

    // Resume file in "cache"
    if (resume.bytearray_as_array) {
        // Convert the array into a byte array
        const byteArray = Uint8Array.from(resume.bytearray_as_array!);
        // https://stackoverflow.com/questions/74401312/javascript-convert-binary-string-to-blob
        const blob = new Blob([byteArray], {type: resume.mime_type!});
        const url = URL.createObjectURL(blob);
        
        // Create an <a href=... then programatically click
        // - https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          resume.file_name!,
        );
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style['display'] = 'none';
        document.body.appendChild(link); // Append to html link element page
        link.click(); // Start download
        link.parentNode!.removeChild(link); // Clean up and remove the link
    } else { // Fetch the resume file
      await fetch(`/api/resume/${resume.id}`)
      .then((res) => { 
        if (!res.ok) {
          throw res;
        }
        return res.json()
      })
      .then((resumeVal: Resume | undefined) => {
        if (resumeVal) {
          // Convert the array into a byte array
          const byteArray = Uint8Array.from(resumeVal.bytearray_as_array!);
          // https://stackoverflow.com/questions/74401312/javascript-convert-binary-string-to-blob
          const blob = new Blob([byteArray], {type: resumeVal.mime_type!});
          const url = URL.createObjectURL(blob);

          // Just replace the job's resume data with resumeVal
          // Then replace the job in jobs
          // - This function can only be called when there's a job with a resume
          job!.resume! = resumeVal;
          const newJobs = jobs.filter((j: Job) => j.id !== job!.id);
          newJobs.push(job);
          setJobs(newJobs);

          // Create an <a href=... then programatically click
          // - https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            resumeVal.file_name!,
          );
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.style['display'] = 'none';
          document.body.appendChild(link); // Append to html link element page
          link.click(); // Start download
          link.parentNode!.removeChild(link); // Clean up and remove the link

          // Alternative:
          // https://stackoverflow.com/questions/69555158/http-response-with-content-disposition-doesnt-trigger-download
          // window.open(url);
        }
      })
      .catch((err) => {
        console.log('Error getting resume!')
      }); 
    }

    target.disabled = false;
  }

  if (job) {
    const dateApplied = job.date_applied;
    const applied = dateApplied ? new Date(dateApplied.year, dateApplied.month, dateApplied.date) : undefined;

    const datePosted = job.date_posted;
    const posted = datePosted ? new Date(datePosted.year, datePosted.month, datePosted.date) : undefined;

    const dateSaved = job.date_saved;
    const saved = dateSaved ? new Date(dateSaved) : undefined;

    const jobStatus = job.job_status;

    const paragraphs = job.job_description ? job.job_description.split(/\r\n|\r|\n/) : [];
    // console.log('paragraphs', paragraphs);
    const notesParagraphs = job.notes ? job.notes.split(/\r\n|\r|\n/) : [];
    // console.log('notesParagraphs', notesParagraphs);

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
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
          <Typography color='#dcdcaa' sx={{fontSize: '20px'}}>
            {`${job.is_remote}`}
          </Typography>
          {/* <HorizontalRuleIcon sx={{color: '#ffffff', margin: '0vw 1vw', alignSelf: 'center'}} /> */}
          <Divider orientation="vertical" flexItem sx={{backgroundColor: '#ffffff', margin: '0px 15px', height: '20px', alignSelf: 'center'}} />
          {/* TODO: Change things so that there's a salary range. */}
          <Typography color='#6a9955' sx={{fontSize: '20px'}}>
            {'$130000/yr - $160000/yr'} {/* Replace this with an actual salary */}
          </Typography>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
          <Typography color='#ffffff' sx={{fontSize: '17px'}}>
            {`${job.city ? job.city : 'N/A'}, ${job.us_state ? job.us_state : 'N/A'}`}
          </Typography>
          {/* <HorizontalRuleIcon sx={{color: '#ffffff', margin: '0vw 1vw'}} /> */}
          <Divider orientation="vertical" flexItem sx={{backgroundColor: '#ffffff', margin: '0px 15px', height: '17px', alignSelf: 'center'}} />
          <Typography color='#ffffff' sx={{fontSize: '17px'}}>
            {job.country ? `${job.country}` : 'N/A'}
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: '#808080', marginTop: 2, marginBottom: 2}} />
        <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginBottom: 1}}>
          {'Description'}
        </Typography>
        { paragraphs.length > 0 ?
          paragraphs.map((paragraph) => 
            paragraph ?
            <Typography color='#ffffff' sx={{fontSize: '17px'}}>
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
            <br />
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
        { notesParagraphs.length > 0 ?
          notesParagraphs.map((paragraph) => 
            paragraph ?
            <Typography color='#ffffff' sx={{fontSize: '17px'}}>
              {paragraph}
            </Typography>
            :
            <br />
          )
          :
          <Typography color='#ffffff' sx={{fontSize: '17px'}}>
            {'N/A'}
          </Typography> 
        }
        <Divider sx={{ backgroundColor: '#808080', marginTop: 2, marginBottom: 2}} />
        {/* TODO: Change the links so that only the text itself is the clickable portion */}
        <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginBottom: 1}}>
          {'Links'}
        </Typography>
        {job.links && job.links.length > 0 ?
          <List sx={{padding: '0px 0px 25px 0px'}}>
            {job.links.map((link) =>
              <ListItem
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
          <Typography color='#ffffff' sx={{fontSize: '17px', padding: '0px 0px 25px 0px'}}>
            {'N/A'}
          </Typography> 
        }
        <Box>
          <Typography display={'inline'} color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginRight: 1}}>
            {'Job posting found from:'} 
          </Typography>
          <Typography display={'inline'} color='#ffffff' sx={{fontSize: '20px', fontWeight: 'bold'}}>
            {job.found_from ? job.found_from : 'N/A'} 
          </Typography>                 
        </Box>
        <Divider sx={{ backgroundColor: '#808080', marginTop: 2, marginBottom: 2}} />
        <Box>
          <Typography display={'inline'} color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginRight: 1}}>
            {'Resume:'} 
          </Typography>
          <Typography display={'inline'} color='#ffffff' sx={{fontSize: '20px', marginRight: 2}}>
            {job.resume?.file_name ? job.resume.file_name : 'N/A'} 
          </Typography>
          {job.resume?.id ?
            (
              <Button
                variant="contained"
                sx={{
                  color: '#ffffff',
                  backgroundColor: '#000000',
                  marginRight: 1,
                  '&:hover': {
                    backgroundColor: '#0b0b0b',
                  },
                  alignSelf: 'center'
                }}
                onClick={
                  (event) =>  {
                    downloadResume(job.resume!, event.currentTarget);
                  }
                }
              >
                <DownloadIcon sx={{ color: '#ffffff', width: 30, height: 30, paddingRight: 1}} />
                {'Download'}
              </Button>             
            )
            :
            undefined
          }               
        </Box>
      </Box>
    );
  }
}