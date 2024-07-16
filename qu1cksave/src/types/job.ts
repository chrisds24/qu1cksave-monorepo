import { YearMonthDate, YearMonthDateFilter } from "./common";
import { CoverLetter, NewCoverLetter } from "./coverLetter";
import { NewResume, Resume } from "./resume";

export interface Job {
  id: string;
  member_id: string;
  resume_id?: string;
  resume?: Resume;
  cover_letter_id?: string;
  cover_letter?: CoverLetter;
  title: string;
  company_name: string;
  job_description?: string;
  notes?: string;
  is_remote: string;
  salary_type?: string;
  salary_min?: number;
  salary_max?: number;
  country?: string;
  us_state?: string;
  city?: string;
  date_saved: string; // Stored as timestamptz in the database
  date_applied?: YearMonthDate;
  date_posted?: YearMonthDate;
  job_status: string;
  links?: string[];
  found_from?: string;
}

export interface NewJob {
  resume_id?: string;
  resume?: NewResume;
  cover_letter_id?: string;
  cover_letter?: NewCoverLetter;
  title: string;
  company_name: string;
  job_description?: string;
  notes?: string;
  is_remote: string;
  salary_type?: string;
  salary_min?: number;
  salary_max?: number;
  country?: string;
  us_state?: string;
  city?: string;
  date_applied?: YearMonthDate;
  date_posted?: YearMonthDate;
  job_status: string;
  links?: string[];
  found_from?: string;
  // In job EDIT mode, used to determine if resume is to be deleted or not
  keepResume?: boolean; 
  keepCoverLetter?: boolean; 
}

export interface Filters {
  title?: string; // job?: string;
  company_name?: string; // company?: string;
  job_status?: string; // status?: string;
  is_remote?: string; // remote?: string;
  city?: string;
  us_state?: string; // state?: string;
  country?: string;
  found_from?: string; // from?: string;
  date_saved?: YearMonthDateFilter;
  date_applied?: YearMonthDateFilter;
  date_posted?: YearMonthDateFilter;
}