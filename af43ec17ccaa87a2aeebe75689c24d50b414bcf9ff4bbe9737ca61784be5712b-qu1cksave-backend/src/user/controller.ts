import { Body, Controller, Get, Path, Post, Query, Response, Route, Security, SuccessResponse } from "tsoa";
import { User, Credentials, NewUser } from ".";
import { UserService } from "./service";
import { verifyNewUserInput } from "../lib/verifyInputs";

@Route("user")
export class UserController extends Controller {
  @Post("login")
  @Response("404", "Not Found")
  @SuccessResponse("200", "OK")
  public async login(@Body() credentials: Credentials): Promise<User | undefined> {
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
  public async signup(@Body() newUser: NewUser): Promise<User | undefined> {
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

  // TODO: Edit this to just return the count
  //    Change route to user/count instead of just user
  //    Change name to getUserCount
  // @Get()
  // @Security("jwt", ["member"])
  // @Response('401', 'Unauthorized')
  // public async getMultiple(): Promise<User[]> {
  //   return new UserService()
  //     .getMultiple()
  //     .then(async (users: User[]): Promise<User[]> => {
  //       return users;
  //     });
  // }
}
