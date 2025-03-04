/**
 * Universal Unique ID
 * @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
 * @example "22fb4152-b1a3-4989-bb0b-33bccf19617e"
 */
export type UUID = string;

export interface YearMonthDate {
  year: number;
  month: number;
  date: number;
}

export interface YearMonthDateFilter {
  year?: number;
  month?: number;
  date?: number;
}

export interface QuickStats {
  'Not Applied': number;
  'Applied': number;
  'Assessment': number;
  'Interview': number;
  'Job Offered': number;
  'Accepted Offer': number;
  'Declined Offer': number;
  'Rejected': number;
  'Ghosted': number;
  'Closed': number;
}

