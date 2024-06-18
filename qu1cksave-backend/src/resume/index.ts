export interface Resume {
  id: string;
  member_id: string;
  name: string;
  file: File; // Not in database
}

export interface NewResume {
  member_id: string;
  name: string;
  file: File; 
}