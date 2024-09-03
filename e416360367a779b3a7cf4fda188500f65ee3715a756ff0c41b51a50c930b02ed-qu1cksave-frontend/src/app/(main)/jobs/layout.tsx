'use client'

import { Context, Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { SessionUserContext } from "../layout";
import { Job } from "@/types/job";
import applyFilters from "@/lib/applyFilters";
import sortJobs from "@/lib/sortJobs";
import { QuickStats, YearMonthDateFilter } from "@/types/common";
import { Dayjs } from "dayjs";
import getQuickStats from "@/lib/getQuickStats";

export const JobsContext: Context<any> = createContext(null);

export default function JobsLayout({
  children,
}: {
  children: ReactNode
}) {
  const { sessionUser } = useContext(SessionUserContext);
  const [jobs, setJobs] = useState<Job[] | undefined>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [page, setPage] = useState<number>(1);
  const [jobsPerPage, setJobsPerPage] = useState<number>(10);
  const [jobsInPage, setJobsInPage] = useState<Job[]>([]);
  const [pageToJumpTo, setPageToJumpTo] = useState<number>();
  const [invalidEntry, setInvalidEntry] = useState<boolean>(false);

  // For dialog
  const [open, setOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [dialogJob, setDialogJob] = useState<Job | undefined>(undefined);

  // For delete dialog
  const [deleteJobOpen, setDeleteJobOpen] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState<string>('');

  // Filters
  //   These are used for the initial load and whenever jobs changes through
  //   add, edit, or delete. For example, we need to automatically apply
  //   the applied filters whenever we change the jobs list.
  // NOTE: These are not the values for the fields in the filters component.
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

  // These are the values for the filter related fields
  // Moving it here so that state is retained when going into a single job
  // view then back.
  const [jobFilterField, setJobFilterField] = useState('');
  const [companyFilterField, setCompanyFilterField] = useState('');
  const [statusFilterField, setStatusFilterField] = useState('');
  const [remoteFilterField, setRemoteFilterField] = useState('');
  const [cityFilterField, setCityFilterField] = useState('');
  const [stateFilterField, setStateFilterField] = useState('');
  const [countryFilterField, setCountryFilterField] = useState('');
  const [fromFilterField, setFromFilterField] = useState('');
  // Saved
  const [savedYearField, setSavedYearField] = useState<Dayjs | null>(null);
  const [savedMonthField, setSavedMonthField] = useState<Dayjs | null>(null);
  const [savedDateField, setSavedDateField] = useState<Dayjs | null>(null);
  // Applied
  const [appliedYearField, setAppliedYearField] = useState<Dayjs | null>(null);
  const [appliedMonthField, setAppliedMonthField] = useState<Dayjs | null>(null);
  const [appliedDateField, setAppliedDateField] = useState<Dayjs | null>(null);
  // Posted
  const [postedYearField, setPostedYearField] = useState<Dayjs | null>(null);
  const [postedMonthField, setPostedMonthField] = useState<Dayjs | null>(null);
  const [postedDateField, setPostedDateField] = useState<Dayjs | null>(null);

  // Current Filters List
  const [currentFilters, setCurrentFilters] = useState<any[]>([]);

  // Sort
  const [sortBy, setSortBy] = useState('Date Saved');
  const [sortIncreasing, setSortIncreasing] = useState(false);

  // Quick Stats
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);

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
          .catch((err) => {
            setJobs(undefined)
            setJobsLoading(false);
            alert(`Error processing request.`)
          }) 
      }
    }
    getJobs();
  }, [sessionUser]);

  // Jobs only changes during: initial load, adding, editing, or deleting.
  //   (Not when going to a single job view then going back.)
  // Filters and sorting should also automatically apply once jobs changes
  useEffect(() => {
    if (jobs !== undefined) {
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
            fromFilter,
            savedFilter,
            appliedFilter,
            postedFilter
          ),
          sortBy,
          sortIncreasing
        )
      );
    }
  }, [jobs]);

  useEffect(() => {
    const filteredJobsCopy = [...filteredJobs];
    setFilteredJobs(
      sortJobs(filteredJobsCopy, sortBy, sortIncreasing)      
    );    
  }, [sortBy, sortIncreasing]);

  useEffect(() => {
    setJobsInPage(filteredJobs.slice(jobsPerPage * (page - 1), jobsPerPage * page));
    setQuickStats(getQuickStats(filteredJobs));
  }, [filteredJobs]);

  // To show skeleton when jobs are loading:
  // - Shows the skeleton list, but doesn't work well since it still shows the
  //   "no jobs yet" message before showing the actual list
  // useEffect(() => {
  //   setJobsLoading(false);
  // }, [jobsInPage])

  useEffect(() => {
    setCurrentFilters(
      [
        {name: 'Job Title', val: jobFilter},
        {name: 'Company', val: companyFilter},
        {name: 'Status', val: statusFilter},
        {name: 'Remote', val: remoteFilter},
        {name: 'City', val: cityFilter},
        {name: 'State', val: stateFilter},
        {name: 'Country', val: countryFilter},
        {name: 'From', val: fromFilter},
        {name: 'Saved', val: savedFilter},
        {name: 'Applied', val: appliedFilter},
        {name: 'Posted', val: postedFilter}
      ]
    )
  }, [
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
  ]);  

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
        // Current filters
        currentFilters,
        // Filter field states
        jobFilterField,
        setJobFilterField,
        companyFilterField,
        setCompanyFilterField,
        statusFilterField,
        setStatusFilterField,
        remoteFilterField,
        setRemoteFilterField,
        cityFilterField,
        setCityFilterField,
        stateFilterField,
        setStateFilterField,
        countryFilterField,
        setCountryFilterField,
        fromFilterField,
        setFromFilterField,
        // Saved Filter Field
        savedYearField,
        setSavedYearField,
        savedMonthField,
        setSavedMonthField,
        savedDateField,
        setSavedDateField,
        // Applied Filter Field
        appliedYearField,
        setAppliedYearField,
        appliedMonthField,
        setAppliedMonthField,
        appliedDateField,
        setAppliedDateField,
        // Posted Filter Field
        postedYearField,
        setPostedYearField,
        postedMonthField,
        setPostedMonthField,
        postedDateField,
        setPostedDateField,
        // Sorting
        sortBy,
        setSortBy,
        sortIncreasing,
        setSortIncreasing,
        // Quick Stats
        quickStats,
        setQuickStats,
        // Jobs Loading
        jobsLoading,
        setJobsLoading
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}