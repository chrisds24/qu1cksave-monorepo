/*
#######################################################################
#
# Copyright (C) 2022-2023 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

import { Body, Controller, Get, Path, Post, Query, Response, Route, Security, SuccessResponse } from "tsoa";
import { User, Credentials, NewUser } from ".";
import { UserService } from "./service";

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
    return new UserService()
      .signup(newUser)
      .then(async (user: User | undefined): Promise<User | undefined> => {
        if (!user) {
          this.setStatus(409);
        }
        return user;
      });
  }

  @Get('{id}')
  @Security("jwt", ["member"])
  @Response('401', 'Unauthorized')
  @Response('404', 'Not Found')
  public async getOne(
    @Path() id: string
  ): Promise<User | undefined> {
    return new UserService()
      .getOne(id)
      .then(async (user: User | undefined): Promise<User | undefined> => {
        if (!user) {
          this.setStatus(404);
        }
        return user;
      });
  }

  @Get()
  @Security("jwt", ["member"])
  @Response('401', 'Unauthorized')
  public async getMultiple(): Promise<User[]> {
    return new UserService()
      .getMultiple()
      .then(async (users: User[]): Promise<User[]> => {
        return users;
      });
  }
}
