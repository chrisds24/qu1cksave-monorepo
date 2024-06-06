import { Job } from "@/types/job";

export function compareDateSaved(jobA: Job, jobB: Job): number {
  const dateA = new Date(jobA.date_saved);
  const dateB = new Date(jobB.date_saved);
  if (dateA < dateB) {
    return 1;
  } else if (dateA > dateB) {
    // Most recently saved comes first in list
    return -1;
  } else {
    return 0;
  }
}

// Applies all filters
// Takes in the filters(which are states) as parameters
export default function applyFilters(jobs: Job[]): Job[] {
  let filteredJobs = jobs;
  // Filters here
  // filteredJobs = filteredJobs.filter((j) => j.company_name === 'Google');

  // Sort last
  filteredJobs.sort(compareDateSaved);

  return filteredJobs;
}