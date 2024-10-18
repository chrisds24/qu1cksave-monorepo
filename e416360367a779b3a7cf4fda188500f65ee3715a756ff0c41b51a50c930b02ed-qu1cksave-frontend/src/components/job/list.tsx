'use client'

import { Box, Stack, Typography } from "@mui/material";
import { Job } from "@/types/job";
import { useContext } from "react";
import JobCard from "./card";
import { JobsContext } from "@/app/(main)/jobs/layout";
import JobsListSkeleton from "../skeleton/jobsListSkeleton";
import sortJobs from "@/lib/sortJobs";
import applyFilters from "@/lib/applyFilters";

export default function JobsList() {
  const { 
    jobs,
    // Filters
    jobFilter,
    companyFilter,
    statusFilter,
    remoteFilter,
    cityFilter,
    stateFilter,
    countryFilter,
    fromFilter,
    savedFilter,
    appliedFilter,
    postedFilter,
    // Loading status
    jobsLoading,
    // Sort options
    sortBy,
    sortIncreasing,
    // Page related
    jobsPerPage,
    page
  } = useContext(JobsContext);

  // Get the jobs for the current page
  // - These jobs are filtered based on the applied filters, sorted based on
  //   the applied sort options, depends on the number of jobs to be shown
  //   for each page, and finally the current page selected 
  const jobsInPage = jobs?.length > 0 ? sortJobs(
    applyFilters(
      jobs,
      jobFilter,
      companyFilter,
      statusFilter,
      remoteFilter,
      cityFilter,
      stateFilter,
      countryFilter,
      fromFilter,
      savedFilter,
      appliedFilter,
      postedFilter
    ),
    sortBy,
    sortIncreasing
  ).slice(jobsPerPage * (page - 1), jobsPerPage * page) : [];

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
            Note: Here, why is flexDirection: 'column' acting like flexDirection: 'row'?
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