// export type Role = "member" | "premium";

export interface Credentials {
  /**
   * @example "newuser@gmail.com"
   * @format email
   */
  email: string;

  /**
   * @example "string"
   */
  password: string;
}

export interface User {
  /**
   * @example 0000-0000-0000-0000-0000-0000-0000-0001
   */
  id: string;

  /**
   * @example "user@gmail.com"
   * @format email
   */
  email: string;

  /**
   * @example "user"
   */
  name: string;

  /**
   * @example ["member"]
   */
  // roles: Role[];
  roles: string[];


  /**
   * @example "user"
   */
  accessToken?: string;
}
