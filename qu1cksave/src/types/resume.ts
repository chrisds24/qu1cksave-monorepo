// string | null used since postgres query fills in empty columns with
//   null open return (due to LEFT JOIN)
export interface Resume {
  id: string | null;
  member_id: string | null;
  job_id?: string | null;
  file_name: string | null;
  mime_type: string | null;
  bytearray_as_array?: Uint8Array;  
}

// Unused for now
export interface NewResume {
  member_id: string;
  job_id?: string;
  file_name: string;
  mime_type: string;
  file: File; // May need to change
}