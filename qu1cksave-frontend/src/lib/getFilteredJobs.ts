import { Job } from "@/types/job";
import applyFilters from "./applyFilters";
import { YearMonthDateFilter } from "@/types/common";

export default function getFilteredJobs(
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
): Job[] {
  // For some reason, jobs?.length won't work here
  return (jobs && jobs.length > 0) ? applyFilters(
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
  ) : [];
}