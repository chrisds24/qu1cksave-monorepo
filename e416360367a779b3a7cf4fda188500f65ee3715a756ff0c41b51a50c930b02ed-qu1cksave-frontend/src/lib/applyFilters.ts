import { YearMonthDate, YearMonthDateFilter } from "@/types/common";
import { Filters, Job } from "@/types/job";

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
  // Search with contains, starts with, or equals?
  // - https://ux.stackexchange.com/questions/86818/substring-search-vs-starting-letter-search
  //   -- Contains is the most useful
  for (const key in filters) {
    // https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b
    // Note for non date related properties:
    //   All filters at this point don't have a falsy value, so
    //   if jobProp ends up as false, then it means that the job
    //   either doesn't have the specified property or it is guaranteed to be
    //   different from filter since no filters are falsy.
    let jobProp = job[key as keyof Job];
    if (jobProp) {
      let filtersProp = filters[key as keyof Filters];
      // jobProp will be a YearMonthDate. Need to go through year and month from filters.
      // Note that date_saved is a string, so need to convert that to YearMonthDate
      if (key === 'date_saved' || key === 'date_applied' || key === 'date_posted') {
        if (key === 'date_saved') { 
          const date = new Date(jobProp as string) // date_saved is a string
          const yearMonthDateObj = {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate()
          } as YearMonthDate;
          jobProp = yearMonthDateObj
        } else {
          jobProp = jobProp as YearMonthDate;
        }
        filtersProp = filtersProp as YearMonthDateFilter;
        if (filtersProp.year) {
          // The job's date saved/applied/posted doesn't have a year or it
          //   doesn't match the year specified by the filter
          if (!jobProp.year || jobProp.year !== filtersProp.year) return false
        }
        // Don't just check if falsy since month could be 0
        if (filtersProp.month !== undefined) {
          // The job's date saved/applied/posted doesn't have a month or it
          //   doesn't match the month specified by the filter
          // if (!jobProp.month || jobProp.month !== filtersProp.month) return false
          if (jobProp.month === undefined || jobProp.month !== filtersProp.month) return false
        }
      } else {
        if (
          !(jobProp as string).toLowerCase().includes(
            (filtersProp as string).toLowerCase()
          )
        ) {
          return false;
        }
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
  saved: YearMonthDateFilter | null,
  applied: YearMonthDateFilter | null,
  posted: YearMonthDateFilter | null
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

  if (saved) filters['date_saved'] = saved
  if (applied) filters['date_applied'] = applied
  if (posted) filters['date_posted'] = posted

  // Filter jobs by those which satisfy all filters
  return jobs.filter((j) => checkFilters(j, filters))
}