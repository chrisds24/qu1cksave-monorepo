import { YearMonthDate } from "./common";

export interface Job {
  id: string;
  member_id: string;
  title: string;
  company_name: string;
  job_description?: string;
  notes?: string;
  is_remote: string;
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
  title: string;
  company_name: string;
  job_description?: string;
  notes?: string;
  is_remote: string;
  country?: string;
  us_state?: string;
  city?: string;
  date_applied?: YearMonthDate;
  date_posted?: YearMonthDate;
  job_status: string;
  links?: string[];
  found_from?: string;
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
}