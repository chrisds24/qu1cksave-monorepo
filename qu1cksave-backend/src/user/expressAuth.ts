import {Request} from "express";
import {UserService} from './service';
import { User } from "./index";

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<User> {
  return new UserService().check(request.headers.authorization, scopes);
}