'use client'

import { Box, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SessionUserContext } from "../layout";
import { Job } from "@/types/job";

export default function Page() {
  let { sessionUser } = useContext(SessionUserContext);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const getJobs = async () => {
      if (sessionUser) {
        // Get all jobs for current user
        await fetch(`/api/job?id=${sessionUser.id}`)
          .then((res) => {
            if (!res.ok) {
              throw res;
            }
            return res.json()
          })
          .then((jobs: Job[]) => {
            setJobs(jobs)
          })
          .catch((err) => {
            alert(`Jobs collection for ${sessionUser.name} not found.`)
          }) 
      }
    }
    getJobs();
  }, [sessionUser]);

  return (
    <Box>
      {`Hello ${sessionUser ? sessionUser.name : 'not logged in'}`}
      <ul>
        {jobs.map((job) => {
          return (
            <li key={job.id}>
              {`Job Title: ${job.title}`} <br />
              {`Company: ${job.company_name}`} <br />
              {`Status: ${job.job_status}`} <br />
              <br />
            </li>
          )
        })}
      </ul>
    </Box>
  );
}