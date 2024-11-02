import { Job } from "@/types/job";
import sortJobs from "./sortJobs";
import applyFilters from "./applyFilters";
import { YearMonthDateFilter } from "@/types/common";

// Search feature TODO: I might need to move this to its own file since other
// components might need it (paginationSection and maybe discreteSliderValues?)
function applySearch(
  jobs: Job[],
  searchInput: string,
  searchBy: string,
) {
  if (!searchInput) { // No search input, so nothing to search by
    return jobs;
  }

  return jobs.filter((job) => {
    const jobProp = job[searchBy as keyof Job];
    if (jobProp) {
      return (jobProp as string).toLowerCase().includes(
        searchInput.toLowerCase()
      )
    }
    // Job doesn't have the specified property to search by
    return false;
  });
};

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