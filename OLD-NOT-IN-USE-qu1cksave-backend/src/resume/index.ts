// string | null used since postgres query fills in empty columns with
//   null on return (due to LEFT JOIN)
export interface Resume {
  id: string | null;
  member_id: string | null;
  file_name: string | null;
  mime_type: string | null;
  // Optional (?) since when returning the jobs list, we don't return the
  //   actual file, only the details
  byte_array_as_array?: number[];
}

export interface NewResume {
  file_name: string;
  mime_type: string;
  byte_array_as_array: number[];  // Changed from Uint8Array to number[]
}