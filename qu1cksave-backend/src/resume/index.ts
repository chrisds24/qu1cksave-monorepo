export interface Resume {
  id: string;
  member_id: string;
  job_id?: string;
  file_name: string;
  mime_type: string;
  bytearray_as_array?: number[];
}

export interface NewResume {
  member_id: string;
  job_id?: string;
  file_name: string;
  mime_type: string;
  file: File; // May need to change
}