'use client'

import { Context, createContext, useContext, useEffect, useState } from "react";
import { SessionUserContext } from "../layout";
import { Job } from "@/types/job";
import JobsList from "@/components/job/list";

export const JobsContext: Context<any> = createContext(null);

export default function Page() {
  let { sessionUser } = useContext(SessionUserContext);
  const [jobs, setJobs] = useState<Job[]>([]);

  // TODO (Maybe): If I want an SPA experience where state is preserved, I
  //   could do all initial data fetches (Ex. getJobs) in the layout.
  //   See CSE 186 Asg 8: Pass hooks in Context
  //
  //   Although this doesn't make much sense since if a user decides to
  //   navigate away from the jobs page, then that means that they're done
  //   working with the jobs page in the meantime.
  //   
  //   Different story with jobs -> single job -> back to jobs.
  //   This is where we want to preserve the context in jobs.
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
    <JobsContext.Provider value={{ jobs }}>
      <JobsList />
    </JobsContext.Provider>
  );
}