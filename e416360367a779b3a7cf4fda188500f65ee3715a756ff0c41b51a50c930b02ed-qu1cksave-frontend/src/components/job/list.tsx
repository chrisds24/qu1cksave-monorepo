'use client'

import { Box, List, ListItem, Stack, Typography } from "@mui/material";
import { Job } from "@/types/job";
import { useContext } from "react";
import JobCard from "./card";
import { JobsContext } from "@/app/(main)/jobs/layout";
import JobsListSkeleton from "../skeleton/jobsListSkeleton";

export default function JobsList() {
  const { jobsInPage, jobs, jobsLoading } = useContext(JobsContext);

  if (!jobsLoading) {
    if (jobs.length > 0) {
      if (jobsInPage.length > 0) {
        return (
          <Stack spacing={'3vh'}>
            {(jobsInPage as Job[]).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </Stack>
        );
      } else {
        return (
          <Box sx={{width: '100%', height: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {/* 
            NOTE: Here, why is flexDirection: 'column' acting like flexDirection: 'row'?
              Here, it's the one that's horizontally centering the box containing the text
            Same thing happens with 'row'. It has reversed behavior for some reason.
              'row' seems to be the one that's vertically centering the text.
          */}
            <Box sx={{display: 'flex', height: '100%', width: '60%', flexDirection: 'row', alignItems: 'center'}}>
              <Typography variant="h3" sx={{fontWeight: 'bold', color: '#ffffff'}}>
                No jobs match the given criteria.
              </Typography>
            </Box>
          </Box>
        );
      }
    } else {
      return (
        <Box sx={{width: '100%', height: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Box sx={{display: 'flex', height: '100%', width: '60%', flexDirection: 'row', alignItems: 'center'}}>
            <Typography variant="h3" sx={{fontWeight: 'bold', color: '#ffffff'}}>
              You haven&apos;t added any jobs yet.
            </Typography>
          </Box>
        </Box>
      );
    }
  } else {
    return (
      <JobsListSkeleton />
    );
  }
}