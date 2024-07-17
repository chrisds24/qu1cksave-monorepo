// /**
//  * Universal Unique ID
//  * @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
//  * @example "22fb4152-b1a3-4989-bb0b-33bccf19617e"
//  */
// export type UUID = string;

import { CoverLetter, NewCoverLetter } from "../coverLetter";
import { NewResume, Resume } from "../resume";

export interface YearMonthDate {
  year: number;
  month: number;
  date: number;
}

// Columns in database table:
//   id, member_id, resume_id, title, company_name, job_description, notes, country, us_state, city,
//   date_saved, date_applied, date_posted, job_status, links, found_from
//   Note that resume is not a column in the database, but is something we can add to a Job after
//   being returned from the database.
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
  // No id, member_id, and date_saved
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