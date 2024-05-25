import { User } from "src/user";

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}

export {}