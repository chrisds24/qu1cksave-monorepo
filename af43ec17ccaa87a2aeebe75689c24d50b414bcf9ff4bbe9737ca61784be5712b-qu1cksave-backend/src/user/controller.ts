import { Body, Controller, Get, Path, Post, Query, Response, Route, Security, SuccessResponse, Request } from "tsoa";
import { User, Credentials, NewUser } from ".";
import { UserService } from "./service";
import { verifyNewUserInput } from "../lib/verifyInputs";
import * as express from 'express';

@Route("user")
export class UserController extends Controller {
  @Post("login")
  @Response("404", "Not Found")
  @Response('401', 'Unauthorized')
  @SuccessResponse("200", "OK")
  public async login(
    @Request() request: express.Request,
    @Body() credentials: Credentials
  ): Promise<User | undefined> {
    // TODO: Need a better way to reject if API Key doesn't exist
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      this.setStatus(401);
      return undefined;
    }
    const splitHeader = authHeader.split(" ");
    if (splitHeader.length < 2 || splitHeader[1] !== process.env.API_KEY) {
      this.setStatus(401);
      return undefined;
    }
    
    return new UserService()
      .login(credentials)
      .then(async (user: User | undefined): Promise<User | undefined> => {
        if (!user) {
          this.setStatus(404);
        }
        return user;
      });
  }

  @Post("signup") 
  @Response("409", "Conflict")
  @SuccessResponse("200", "OK")
  public async signup(
    @Request() request: express.Request,
    @Body() newUser: NewUser
  ): Promise<User | undefined> {
    // TODO: Need a better way to reject if API Key doesn't exist
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      this.setStatus(401);
      return undefined;
    }
    const splitHeader = authHeader.split(" ");
    if (splitHeader.length < 2 || splitHeader[1] !== process.env.API_KEY) {
      this.setStatus(401);
      return undefined;
    }

    if (!verifyNewUserInput(newUser)) {
      return undefined
    }
    return new UserService()
      .signup(newUser)
      .then(async (user: User | undefined): Promise<User | undefined> => {
        if (!user) {
          this.setStatus(409);
        }
        return user;
      });
  }
}
