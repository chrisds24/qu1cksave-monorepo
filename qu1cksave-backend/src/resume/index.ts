export interface Resume {
  id: string;
  member_id: string;
  file_name: string;
  bytearray_as_array?: number[];
}

export interface NewResume {
  member_id: string;
  file_name: string;
  file: File; 
}