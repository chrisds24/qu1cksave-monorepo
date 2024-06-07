'use client'

import { Context, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { SessionUserContext } from "../layout";
import { Job } from "@/types/job";
import applyFilters from "@/lib/applyFilters";
import sortJobs from "@/lib/sortJobs";

export const JobsContext: Context<any> = createContext(null);

export default function JobsLayout({
  children,
}: {
  children: ReactNode
}) {
  const { sessionUser } = useContext(SessionUserContext);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [page, setPage] = useState<number>(1);
  const [jobsPerPage, setJobsPerPage] = useState<number>(10);
  const [jobsInPage, setJobsInPage] = useState<Job[]>([]);
  const [pageToJumpTo, setPageToJumpTo] = useState<number>();
  const [invalidEntry, setInvalidEntry] = useState<boolean>(false);

  // For modal/dialog
  const [open, setOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [dialogJob, setDialogJob] = useState<Job | undefined>(undefined);

  // Filters
  const [jobFilter, setJobFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Dropdown
  const [remoteFilter, setRemoteFilter] = useState(''); // Dropdown
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState(''); // Dropdown
  const [countryFilter, setCountryFilter] = useState('');
  const [fromFilter, setFromFilter] = useState('');

  // Sort
  const [sortCriteria, setSortCriteria] = useState('Date Saved');
  const [sortIncreasing, setSortIncreasing] = useState(false);

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

  // Jobs only changes during: initial load, adding, editing, or deleting.
  //   (Not when going to a single job view then going back.)
  // Filters and sorting should also automatically apply once jobs changes
  useEffect(() => {
    setFilteredJobs(
      sortJobs(
        applyFilters(
          jobs,
          jobFilter,
          companyFilter,
          statusFilter,
          remoteFilter,
          cityFilter,
          stateFilter,
          countryFilter,
          fromFilter
        ),
        sortCriteria,
        sortIncreasing
      )
    );
  }, [jobs]);

  useEffect(() => {
    setJobsInPage(filteredJobs.slice(jobsPerPage * (page - 1), jobsPerPage * page));
  }, [filteredJobs]);

  return (
    <JobsContext.Provider
      value={{
        jobs,
        setJobs,
        filteredJobs,
        setFilteredJobs,
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
        setDialogJob,
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
        sortCriteria,
        setSortCriteria,
        sortIncreasing,
        setSortIncreasing
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}