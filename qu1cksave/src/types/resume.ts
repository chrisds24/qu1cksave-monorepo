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
  // There's a ? in the case that we're adding a new job
  //   Though, this isn't needed since we should be using the request.user.id from the request
  //   during the API call
  member_id?: string;
  job_id?: string;
  file_name: string;
  mime_type: string;
  // bytearray_as_array: Uint8Array;  
  bytearray_as_array?: number[];
}