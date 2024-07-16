// string | null used since postgres query fills in empty columns with
//   null open return (due to LEFT JOIN)
export interface CoverLetter {
  id: string | null;
  member_id: string | null;
  job_id?: string | null;
  file_name: string | null;
  mime_type: string | null;
  bytearray_as_array?: number[];
}

export interface NewCoverLetter {
  // There's a ? in the case that we're adding a new job
  //   Though, this isn't needed since we should be using the request.user.id from the request
  //   during the API call
  member_id?: string;
  job_id?: string;
  file_name: string;
  mime_type: string;
  bytearray_as_array?: number[];
}