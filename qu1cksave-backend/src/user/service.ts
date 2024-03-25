import * as bcrypt from "bcrypt";

import { User, Credentials } from ".";
import { pool } from "../db";

import "whatwg-fetch";

export class UserService {
  public async login(credentials: Credentials): Promise<User | undefined> {
    const select = "SELECT * FROM member WHERE email ILIKE $1 AND NOT suspended";
    const query = {
      text: select,
      values: [credentials.email],
    };
    const { rows } = await pool.query(query);
    const user = rows.length == 1 ? rows[0] : undefined;
    if (user && bcrypt.compareSync(credentials.password, user.password)) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      };
    } else {
      return undefined;
    }
  }
}
