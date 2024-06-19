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
  const { jobs, setIsAdd, setOpen, setDialogJob } = useContext(JobsContext);
  const filteredJobs = (jobs as Job[]).filter((job) => job.id === params.id);
  const job = filteredJobs.length == 1 ? filteredJobs[0] : undefined;
  const [resume, setResume] = useState<Resume | undefined>(undefined);
  // WARNING !!! Putting the signedUrl returned by getSignedUrl into the download button
  //   shows the credentials on hover !!!
  // - https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js
  //   -- Could be an alternative
  // TODO: Remove resumeUrl state and getUrl related code


  // const [resumeUrl, setResumeUrl] = useState<string>('');

  // const getUrl = (resumeInput: Resume) => {
  //   const blob = new Blob([resumeInput.file], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  //   const file = new File([blob], resumeInput.name);
  //   const resumeURL = URL.createObjectURL(file);
  //   console.log(`resumeURL(page.tsx): ${resumeURL}`)
  //   return resumeURL;
  // }

  useEffect(() => {
    if (job?.resume_id) {
      const getResume = async () => {
        await fetch(`/api/resume/${job.resume_id}`)
          .then((res) => {
            if (res.ok) {
              return res.json()
            }
          })
          .then((resumeJson) => {
            setResume(resumeJson);
            // setResumeUrl(getUrl(resumeJson))
          }) 
      }
      getResume();
    }
  }, [job?.resume_id])

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
        {resume ?
          (
            <Button variant="contained" sx={{ backgroundColor: '#00274e' }} href={`${resume.url}`} download rel="noopener noreferrer">
            {/* // <Button variant="contained" sx={{ backgroundColor: '#00274e' }} href={`${resumeUrl}`} download rel="noopener noreferrer"> */}
              <DownloadIcon sx={{ color: '#ffffff', width: 40, height: 40, paddingRight: 1}} />
              {resume.name}
            </Button>            
          )
          :
          undefined
        }
      </Box>
    );
  }
}