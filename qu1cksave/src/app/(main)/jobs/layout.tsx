'use client'

import { Context, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { SessionUserContext } from "../layout";
import { Job } from "@/types/job";

export const JobsContext: Context<any> = createContext(null);

export default function JobsLayout({
  children,
}: {
  children: ReactNode
}) {
  const { sessionUser } = useContext(SessionUserContext);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [page, setPage] = useState<number>(1);
  const [jobsPerPage, setJobsPerPage] = useState<number>(10);
  const [jobsInPage, setJobsInPage] = useState<Job[]>([]);
  const [pageToJumpTo, setPageToJumpTo] = useState<number>();
  const [invalidEntry, setInvalidEntry] = useState<boolean>(false);

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
            setJobsInPage(jobs.slice(jobsPerPage * (page - 1), jobsPerPage * page));
          })
          .catch((err) => {
            alert(`Jobs collection for ${sessionUser.name} not found.`)
          }) 
      }
    }
    getJobs();
  }, [sessionUser]);

  return (
    <JobsContext.Provider
      value={{
        jobs,
        setJobs,
        page,
        setPage,
        jobsPerPage,
        setJobsPerPage,
        jobsInPage,
        setJobsInPage,
        pageToJumpTo,
        setPageToJumpTo,
        invalidEntry,
        setInvalidEntry
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}