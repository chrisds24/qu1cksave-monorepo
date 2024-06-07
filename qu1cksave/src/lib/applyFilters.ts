import { Filters, Job } from "@/types/job";

// TODO: Move this to sort file
function compareDateSaved(jobA: Job, jobB: Job): number {
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

function checkFilters(
  job: Job,
  filters: Filters
): boolean {
  // 3 cases:
  // 1.) job has same exact properties specified in filters (doesn't necessarily mean they're equal)
  //     - Check if the job's properties matches filters
  // 2.) job has all properties specified in filters, but also has other properties
  //     - Check if the properties specified by the filters are equal
  // 3.) job is missing at least one property specified in the filters
  //     - Job can't satisfy the filters
  for (const key in filters) {
    // https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b
    // If the job doesn't have the property specified by the current filter
    // Note that all filters at this point don't have a falsy value, so
    //   if jobProp ends up as false, then it means that the job
    //   either doesn't have the specified property or it is guaranteed to be
    //   different from filter since no filters are falsy.
    const jobProp = job[key as keyof Job];
    if (jobProp) {
      if (jobProp !== filters[key as keyof Filters]) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
}

// Applies all filters
export default function applyFilters(
  jobs: Job[],
  job: string,
  company: string,
  status: string,
  remote: string,
  city: string,
  state: string,
  country: string,
  from: string,
): Job[] {
  const filters: Filters = {};
  if (job) filters['title'] = job
  if (company) filters['company_name'] = company
  if (status) filters['job_status'] = status
  if (remote) filters['is_remote'] = remote
  if (city) filters['city'] = city
  if (state) filters['us_state'] = state
  if (country) filters['country'] = country
  if (from) filters['found_from'] = from

  // TODO: Convert savedYear, savedMonth, and savedDate as YearMonthDate (same for applied and posted)

  // Filter jobs by those which satisfy all filters
  return jobs.filter((j) => checkFilters(j, filters))

  // Sort last
  // TODO: Take this out of here, sort should be applied automatically when sort option is selected.
  // filteredJobs.sort(compareDateSaved);
}