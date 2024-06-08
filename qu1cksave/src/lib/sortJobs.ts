import { Job } from "@/types/job";

// Sorts by most recently saved first (newest)
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

// Sorts by least recently saved first (oldest)
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

// Sorts by most recently applied first (newest)
function compareDateAppliedDecreasing(jobA: Job, jobB: Job): number {
  const dateAppliedA = jobA.date_applied;
  const dateAppliedB = jobB.date_applied;
  if (dateAppliedA && dateAppliedB) { // Both have date applied
    const dateA = new Date(dateAppliedA.year, dateAppliedA.month, dateAppliedA.date);
    const dateB = new Date(dateAppliedB.year, dateAppliedB.month, dateAppliedB.date);
    if (dateA < dateB) {
      return 1;
    } else if (dateA > dateB) {
      // Most recently applied comes first in list
      return -1;
    } else {
      return 0;
    }
  } else if (dateAppliedA && !dateAppliedB) { // Only A has date applied
    return -1; // Those with date applied come in first
  } else if (!dateAppliedA && dateAppliedB) { // Only B has date applied
    return 1; 
  } else { // Both don't have date applied, so order doesn't matter
    return 0;
  }
}

// Sorts by least recently applied first (oldest)
function compareDateAppliedIncreasing(jobA: Job, jobB: Job): number {
  const dateAppliedA = jobA.date_applied;
  const dateAppliedB = jobB.date_applied;
  if (dateAppliedA && dateAppliedB) { // Both have date applied
    const dateA = new Date(dateAppliedA.year, dateAppliedA.month, dateAppliedA.date);
    const dateB = new Date(dateAppliedB.year, dateAppliedB.month, dateAppliedB.date);
    if (dateA < dateB) {
      // Least recently applied comes first in list
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      return 0;
    }
  } else if (dateAppliedA && !dateAppliedB) { // Only A has date applied
    return -1; // Those with date applied come in first
  } else if (!dateAppliedA && dateAppliedB) { // Only B has date applied
    return 1; 
  } else { // Both don't have date applied, so order doesn't matter
    return 0;
  }
}

// Sorts by most recently posted first (newest)
function compareDatePostedDecreasing(jobA: Job, jobB: Job): number {
  const datePostedA = jobA.date_posted;
  const datePostedB = jobB.date_posted;
  if (datePostedA && datePostedB) { // Both have date posted
    const dateA = new Date(datePostedA.year, datePostedA.month, datePostedA.date);
    const dateB = new Date(datePostedB.year, datePostedB.month, datePostedB.date);
    if (dateA < dateB) {
      return 1;
    } else if (dateA > dateB) {
      // Most recently posted comes first in list
      return -1;
    } else {
      return 0;
    }
  } else if (datePostedA && !datePostedB) { // Only A has date posted
    return -1; // Those with date posted come in first
  } else if (!datePostedA && datePostedB) { // Only B has date posted
    return 1; 
  } else { // Both don't have date posted, so order doesn't matter
    return 0;
  }
}

// Sorts by least recently posted first (oldest)
function compareDatePostedIncreasing(jobA: Job, jobB: Job): number {
  const datePostedA = jobA.date_posted;
  const datePostedB = jobB.date_posted;
  if (datePostedA && datePostedB) { // Both have date posted
    const dateA = new Date(datePostedA.year, datePostedA.month, datePostedA.date);
    const dateB = new Date(datePostedB.year, datePostedB.month, datePostedB.date);
    if (dateA < dateB) {
      // Least recently posted comes first in list
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      return 0;
    }
  } else if (datePostedA && !datePostedB) { // Only A has date posted
    return -1; // Those with date posted come in first
  } else if (!datePostedA && datePostedB) { // Only B has date posted
    return 1; 
  } else { // Both don't have date posted, so order doesn't matter
    return 0;
  }
}

// Sorts by job title in alphabetical order
function compareJobTitleIncreasing(jobA: Job, jobB: Job): number {
  const titleA = jobA.title;
  const titleB = jobB.title;
  if (titleA < titleB) {
    return -1;
  } else if (titleA > titleB) {
    return 1;
  } else {
    return 0;
  }
}

// Sorts by job title in reverse alphabetical order
function compareJobTitleDecreasing(jobA: Job, jobB: Job): number {
  const titleA = jobA.title;
  const titleB = jobB.title;
  if (titleA < titleB) {
    return 1;
  } else if (titleA > titleB) {
    return -1;
  } else {
    return 0;
  }
}

// Sorts by company name in alphabetical order
function compareCompanyNameIncreasing(jobA: Job, jobB: Job): number {
  const companyA = jobA.company_name;
  const companyB = jobB.company_name;
  if (companyA < companyB) {
    return -1;
  } else if (companyA > companyB) {
    return 1;
  } else {
    return 0;
  }
}

// Sorts by company name in reverse alphabetical order
function compareCompanyNameDecreasing(jobA: Job, jobB: Job): number {
  const companyA = jobA.company_name;
  const companyB = jobB.company_name;
  if (companyA < companyB) {
    return 1;
  } else if (companyA > companyB) {
    return -1;
  } else {
    return 0;
  }
}

// - sortBy specifies if we're sorting by date saved/applied/posted or
//   alphabetically (job title or company name).
// - increasing specifies if we should sort in increasing order. 
export default function sortJobs(jobs: Job[], sortBy: string, increasing: boolean): Job[] {
  if (increasing) {
    switch (sortBy) {
      case 'Date Saved':
        jobs.sort(compareDateSavedIncreasing);
        break;
      case 'Date Applied':
        jobs.sort(compareDateAppliedIncreasing);
        break;
      case 'Date Posted':
        jobs.sort(compareDatePostedIncreasing);
        break;
      case 'Job Title':
        jobs.sort(compareJobTitleIncreasing);
        break;
      case 'Company':
        jobs.sort(compareCompanyNameIncreasing);
        break;
      default:
        jobs.sort(compareDateSavedIncreasing);
    }
  } else {
    switch (sortBy) {
      case 'Date Saved':
        jobs.sort(compareDateSavedDecreasing);
        break;
      case 'Date Applied':
        jobs.sort(compareDateAppliedDecreasing);
        break;
      case 'Date Posted':
        jobs.sort(compareDatePostedDecreasing);
        break;
      case 'Job Title':
        jobs.sort(compareJobTitleDecreasing);
        break;
      case 'Company':
        jobs.sort(compareCompanyNameDecreasing);
        break;
      default:
        jobs.sort(compareDateSavedDecreasing);
    }
  }

  return jobs;
}