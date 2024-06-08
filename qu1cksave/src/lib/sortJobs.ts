import { Job } from "@/types/job";

// Sorts by most recently saved first
function compareDateSavedDecreasing(jobA: Job, jobB: Job): number {
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

// Sorts by least recently saved first
function compareDateSavedIncreasing(jobA: Job, jobB: Job): number {
  const dateA = new Date(jobA.date_saved);
  const dateB = new Date(jobB.date_saved);
  if (dateA < dateB) {
    // Least recently saved comes first in list
    return -1;
  } else if (dateA > dateB) {
    return 1;
  } else {
    return 0;
  }
}

// TODO: sortBy specifies if we're sorting by date saved/applied/posted or
// alphabetically (job title or company name).
// Increasing specifies if we should sort in increasing order. 
export default function sortJobs(jobs: Job[], sortBy: string, increasing: boolean): Job[] {
  if (increasing) {
    jobs.sort(compareDateSavedIncreasing);
  } else {
    jobs.sort(compareDateSavedDecreasing);
  }
  return jobs;
}