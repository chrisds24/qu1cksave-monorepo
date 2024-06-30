// TODO: Use this until SQL query is updated
export interface Resume {
  id: string | null;
  member_id: string | null;
  job_id?: string | null;
  file_name: string | null;
  mime_type: string | null;
  bytearray_as_array?: number[];
}

// Unused for now
export interface NewResume {
  member_id: string;
  job_id?: string;
  file_name: string;
  mime_type: string;
  bytearray_as_array: Uint8Array;  
}