'use client'

import { Context, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { SessionUserContext } from "../layout";
import { Job } from "@/types/job";
import compareDateSaved from "@/lib/applyFilters";

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
  const [open, setOpen] = useState(false); // For modal
  const [isAdd, setIsAdd] = useState(true); // For modal
  const [dialogJob, setDialogJob] = useState<Job | undefined>(undefined);

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
            jobs.sort(compareDateSaved);
            setJobs(jobs)
            // setJobsInPage(jobs.slice(jobsPerPage * (page - 1), jobsPerPage * page));
          })
          .catch((err) => {
            alert(`Jobs collection for ${sessionUser.name} not found.`)
          }) 
      }
    }
    getJobs();
  }, [sessionUser]);

  useEffect(() => {
    setJobsInPage(jobs.slice(jobsPerPage * (page - 1), jobsPerPage * page));
  }, [jobs]);

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
        setInvalidEntry,
        open,
        setOpen,
        isAdd,
        setIsAdd,
        dialogJob,
        setDialogJob
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}