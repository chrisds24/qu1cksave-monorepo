'use client'

import { Box, List, ListItem, Stack } from "@mui/material";
import { Job } from "@/types/job";
import { JobsContext } from "@/app/(main)/jobs/page";
import { useContext } from "react";
import JobCard from "./card";

export default function JobsList() {
  const { jobsInPage } = useContext(JobsContext);

  if (jobsInPage) {
    return (
      <Stack spacing={'3vh'}>
        {(jobsInPage as Job[]).map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </Stack>
    );
  }
}