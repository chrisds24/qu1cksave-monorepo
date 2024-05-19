'use client'

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { JobsContext } from "../layout";
import { Job } from "@/types/job";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { jobs } = useContext(JobsContext);
  const filteredJobs = (jobs as Job[]).filter((job) => job.id === params.id);
  const job = filteredJobs.length == 1 ? filteredJobs[0] : undefined;

  if (job) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
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
        <Typography color='#4fc1ff' fontWeight='bold' sx={{fontSize: '19px'}}>
          {`${job.title}`}
        </Typography>
      </Box>
    );
  }
}