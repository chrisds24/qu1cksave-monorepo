// /**
//  * Universal Unique ID
//  * @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
//  * @example "22fb4152-b1a3-4989-bb0b-33bccf19617e"
//  */
// export type UUID = string;

export interface YearMonthDate {
  year: number;
  month: number;
  date: number;
}

// Columns in database table:
//   id, member_id, title, company_name, job_description, notes, country, us_state, city,
//   date_saved, date_applied, date_posted, job_status, links, found_from
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