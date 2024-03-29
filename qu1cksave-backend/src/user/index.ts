/**
 * Universal Unique ID
 * @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
 * @example "22fb4152-b1a3-4989-bb0b-33bccf19617e"
 */
export type UUID = string;

// export type Role = "member" | "premium"; // Might not need this

export interface Credentials {
  /**
   * @format email
   */
  email: string;
  password: string;
}

export interface NewUser extends Credentials {
  name: string;
}

export interface User {
  id: UUID;
  /**
   * @format email
   */
  email: string;
  name: string;
  // roles: Role[];
  roles: string[];
  accessToken?: string;
}
