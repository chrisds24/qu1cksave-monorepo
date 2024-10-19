'use client'

import { Context, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { SessionUserContext } from "../layout";
import { Job } from "@/types/job";
import { YearMonthDateFilter } from "@/types/common";

export const JobsContext: Context<any> = createContext(null);

export default function JobsLayout({
  children,
}: {
  children: ReactNode
}) {
  const { sessionUser } = useContext(SessionUserContext);

  // The reason for the undefined is when there's an error?
  const [jobs, setJobs] = useState<Job[] | undefined>([]);
  const [page, setPage] = useState<number>(1);
  const [jobsPerPage, setJobsPerPage] = useState<number>(10);

  // React TODO:
  // - I don't think I want the current behavior where if the dialog is open in
  //   the single job view and we press back to go to the jobs list view, the
  //   dialog remains open.
  // For dialog
  // - Used by both jobs/page.tsx and jobs/[id]/page.tsx
  // - Note that jobs/[id]/page.tsx is not a subroute of jobs/page.tsx
  //   -- It is a subroute of jobs, which is why state is in the layout
  const [open, setOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [dialogJob, setDialogJob] = useState<Job | undefined>(undefined);

  // React TODO:
  // - Same idea as for the addOrEditDialog
  // For delete dialog
  // - Same idea as for the addOrEditDialog
  const [deleteJobOpen, setDeleteJobOpen] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState<string>('');

  // Filters
  //   These are used for the initial load and whenever jobs changes through
  //   add, edit, or delete. For example, we need to automatically apply
  //   the applied filters whenever we change the jobs list.
  // Note: These are not the values for the fields in the filters component.
  const [jobFilter, setJobFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Dropdown
  const [remoteFilter, setRemoteFilter] = useState(''); // Dropdown
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState(''); // Dropdown
  const [countryFilter, setCountryFilter] = useState('');
  const [fromFilter, setFromFilter] = useState('');
  const [savedFilter, setSavedFilter]  = useState<YearMonthDateFilter | null>(null);
  const [appliedFilter, setAppliedFilter] = useState<YearMonthDateFilter | null>(null);
  const [postedFilter, setPostedFilter] = useState<YearMonthDateFilter | null>(null);

  // Sort
  const [sortBy, setSortBy] = useState('Date Saved');
  const [sortIncreasing, setSortIncreasing] = useState(false);

  // Jobs Loading
  // - Used to indicate if we're showing the skeleton for the jobs
  //   list or not.
  // - I could have made jobs be of type undefined | Jobs[], but
  //   a lot of things rely on jobs being an array. This achieves
  //   the same purpose w/o needing to change a lot of code.
  const [jobsLoading, setJobsLoading] = useState<boolean>(true); 

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
            setJobsLoading(false);
          })
          .catch(() => {
            setJobs(undefined)
            setJobsLoading(false);
            alert(`Error processing request.`)
          }) 
      }
    }
    getJobs();
  }, [sessionUser]);

  // React TODO:
  // - I need to split the Context Providers
  return (
    <JobsContext.Provider
      value={{
        jobs,
        setJobs,
        page,
        setPage,
        jobsPerPage,
        setJobsPerPage,
        // Add or edit dialog
        open,
        setOpen,
        isAdd,
        setIsAdd,
        dialogJob,
        setDialogJob,
        // Delete job dialog
        deleteJobOpen,
        setDeleteJobOpen,
        deleteJobId,
        setDeleteJobId,
        // Filters
        jobFilter,
        setJobFilter,
        companyFilter,
        setCompanyFilter,
        statusFilter,
        setStatusFilter,
        remoteFilter,
        setRemoteFilter,
        cityFilter,
        setCityFilter,
        stateFilter,
        setStateFilter,
        countryFilter,
        setCountryFilter,
        fromFilter,
        setFromFilter,
        savedFilter,
        setSavedFilter,
        appliedFilter,
        setAppliedFilter,
        postedFilter,
        setPostedFilter,
        // Sorting
        sortBy,
        setSortBy,
        sortIncreasing,
        setSortIncreasing,
        // Jobs Loading
        jobsLoading,
        setJobsLoading
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}