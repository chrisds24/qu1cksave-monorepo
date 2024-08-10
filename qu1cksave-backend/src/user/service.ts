import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import { User, Credentials, NewUser } from ".";
import { pool } from "../db";

import "whatwg-fetch";

export class UserService {
  public async login(credentials: Credentials): Promise<User | undefined> {
    const select = "SELECT * FROM member WHERE email = $1";
    const query = {
      text: select,
      // text: 'Bad query', // TESTING
      values: [credentials.email],
    };

    try {
      const { rows } = await pool.query(query);
      const user = rows.length == 1 ? rows[0] : undefined;

      // If the user exists and the passwords match
      // - For generating the secret key:
      //   -- https://stackoverflow.com/questions/31309759/what-is-secret-key-for-jwt-based-authentication-and-how-to-generate-it
      //   -- https://dev.to/tkirwa/generate-a-random-jwt-secret-key-39j4
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        const accessToken = jwt.sign(
          { id: user.id, name: user.name, email: user.email, roles: user.roles },
          process.env.ACCESS_TOKEN as string,
          {
            expiresIn: "120m",
            algorithm: "HS256",
          }
        );

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          accessToken: accessToken
        };
      } else {
        return undefined;
      }
    } catch {
      return undefined;
    }
  }

  public async signup(newUser: NewUser): Promise<User | undefined> {
    const select = "SELECT * FROM member WHERE email = $1";
    const query = {
      text: select,
      // text: 'Bad query', // TESTING
      values: [newUser.email],
    };

    try {
      const { rows } = await pool.query(query);
      const existingUser = rows.length == 1 ? rows[0] : undefined;
  
      if (existingUser) { // Given email is already associated with an existing user
        return undefined;
      } else {
        const hashedPassword = bcrypt.hashSync(newUser.password, 10);
        const insert = "INSERT INTO member (name, email, roles, password) VALUES ($1, $2, $3, $4) RETURNING *";
        const query = {
          text: insert,
          // text: 'Bad query', // TESTING
          values: [newUser.name, newUser.email, JSON.stringify(["member"]), hashedPassword],
        };
        // try {
        const { rows } = await pool.query(query);
        const user = rows[0];
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        };
        // } catch(err) {
        //   return undefined;
        // }     
      }
    } catch (err) {
      // console.error(err);
      return undefined;
    }
  }

  public async check(authHeader?: string, scopes?: string[]): Promise<User> {
    console.log('I GOT HERE') // TESTING (REMOVE THIS LATER !!!)

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
            // This branch checks the scopes of the endpoint. If the endpoint
            //   doesn't have scopes, then we still resolve the user.
            // So the "else if (scopes)" condition is correct
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

  // TODO: Edit this to only return the user count
  // public async getMultiple(): Promise<User[]> {
  //   const select = "SELECT id, name, email, roles FROM member";
  //   const query = {
  //     text: select,
  //   };
  //   const { rows } = await pool.query(query);
  //   return rows as User[];
  // }
}
