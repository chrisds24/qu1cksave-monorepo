import * as jwt from "jsonwebtoken";
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

    return new Promise((resolve, reject) => {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        const accessToken = jwt.sign(
          { id: user.id, name: user.name, email: user.email, roles: user.roles },
          process.env.ACCESS_TOKEN as string,
          {
            expiresIn: "90m",
            algorithm: "HS256",
          }
        );
        resolve({
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          accessToken: accessToken
        });
      } else {
        reject(new Error("Unauthorized"));
      }
    });
  }

  public async check(authHeader?: string, scopes?: string[]): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!authHeader) {
        reject(new Error("Unauthorized"));
      } else {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN as string, (err, decoded) => {
          if (err) {
            reject(err);
            return;
          } else if (scopes) {
            const user = decoded as User;
            for (const scope of scopes) {
              if (!user.roles.includes(scope)) {
                reject(new Error("Unauthorized"));
                return;
              }
            }
          }
          resolve(decoded as User);
        });
      }
    });
  }
}
