// string | null used since postgres query fills in empty columns with
//   null open return (due to LEFT JOIN)
export interface Resume {
  id: string | null;
  member_id: string | null;
  job_id?: string | null;
  file_name: string | null;
  mime_type: string | null;
  // For some reason this works even though the API returns a number[]
  //   bytearray_as_array?: Uint8Array;
  bytearray_as_array?: number[];
}

// Unused for now
export interface NewResume {
  member_id: string;
  job_id?: string;
  file_name: string;
  mime_type: string;
  // bytearray_as_array: Uint8Array;  
  bytearray_as_array?: number[];
}