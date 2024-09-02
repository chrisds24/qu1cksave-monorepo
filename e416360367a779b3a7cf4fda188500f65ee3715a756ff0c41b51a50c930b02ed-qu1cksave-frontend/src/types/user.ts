// import { UUID } from "./common";

export interface User {
  id: string;
  /**
   * @format email
   */
  email: string;
  name: string;
  // roles: Role[];
  roles: string[];
  accessToken?: string;
}