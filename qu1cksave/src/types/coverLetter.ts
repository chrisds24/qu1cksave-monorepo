// string | null used since postgres query fills in empty columns with
//   null open return (due to LEFT JOIN)
export interface CoverLetter {
  id: string | null;
  member_id: string | null;
  file_name: string | null;
  mime_type: string | null;
  bytearray_as_array?: number[];
}

export interface NewCoverLetter {
  file_name: string;
  mime_type: string;
  bytearray_as_array: number[];
}