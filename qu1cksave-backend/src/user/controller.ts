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

import { Body, Controller, Get, Post, Response, Route, Security, SuccessResponse } from "tsoa";
import { User, Credentials } from ".";
import { UserService } from "./service";

@Route("user")
export class UserController extends Controller {
  @Post("login")
  @Response("404", "Not found")
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

  // Get all Users
  @Get('')
  @Security("jwt", ["member"])
  @Response('401', 'Unauthorised')
  public async getAll(): Promise<User[]> {
    return new UserService().getAll();
  }
}
