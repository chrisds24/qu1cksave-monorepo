import { Job } from "@/types/job";
import sortJobs from "./sortJobs";
import applyFilters from "./applyFilters";
import { YearMonthDateFilter } from "@/types/common";
import applySearch from "./applySearch";

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
  page: number,
  searchInput: string,
  searchBy: string,
): Job[] {
  // For some reason, jobs?.length won't work here
  return (jobs && jobs.length > 0) ? sortJobs(
    applySearch(
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
      searchInput,
      searchBy
    ),
    sortBy,
    sortIncreasing
  ).slice(jobsPerPage * (page - 1), jobsPerPage * page) : [];
}