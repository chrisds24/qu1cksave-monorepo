import { Job } from "@/types/job";
import sortJobs from "./sortJobs";
import applyFilters from "./applyFilters";
import { YearMonthDateFilter } from "@/types/common";

export default function getJobsInPage(
  jobs: Job[] | undefined,
  jobFilter: string,
  companyFilter: string,
  statusFilter: string,
  remoteFilter: string,
  cityFilter: string,
  stateFilter: string,
  countryFilter: string,
  fromFilter: string,
  savedFilter: YearMonthDateFilter | null,
  appliedFilter: YearMonthDateFilter | null,
  postedFilter: YearMonthDateFilter | null,
  sortBy: string,
  sortIncreasing: boolean,
  jobsPerPage: number,
  page: number
): Job[] {
  // For some reason, jobs?.length won't work here
  return (jobs && jobs.length > 0) ? sortJobs(
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
}