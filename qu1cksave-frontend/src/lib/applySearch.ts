import { Job } from "@/types/job";

export default function applySearch(
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