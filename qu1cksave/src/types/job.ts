import { YearMonthDate } from "./common";

export interface Job {
  id: string;
  member_id: string;
  title: string;
  company_name: string;
  job_description?: string;
  notes?: string;
  country?: string;
  us_state?: string;
  city?: string;
  date_saved: string; // Stored as timestamptz in the database
  date_applied?: YearMonthDate;
  date_posted?: YearMonthDate;
  job_status: string;
  links?: string;
  found_from?: string;
}