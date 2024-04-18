'use client'

import { Box, Stack } from "@mui/material";
import { Job } from "@/types/job";
import { JobsContext } from "@/app/(main)/jobs/page";
import { useContext } from "react";
import JobCard from "./card";

export default function JobsList() {
  let { jobs } = useContext(JobsContext);
  if (jobs) {
    return (
      <Stack spacing={'3vh'}>
        {(jobs as Job[]).map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </Stack>
    );
  } else {
    return (
      <>
        Loading
      </>
    )
  }
}