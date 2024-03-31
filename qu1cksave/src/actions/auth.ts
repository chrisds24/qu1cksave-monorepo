'use server'

import { User } from "@/types/user";
import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function login(formdata: FormData): Promise<User | undefined> {
    const credentials = {email: formdata.get('email'), password: formdata.get('password')};

    let user: User | undefined = undefined;
    await fetch("http://localhost:3010/api/v0/user/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((user) => {
        const expires = new Date(Date.now() + 2*60*60*1000); // Expires in 2 hours
        // Switch to this once using https
        //   cookies().set("session", user.accessToken, { expires, httpOnly: true, secure: true });
        cookies().set("session", user.accessToken, { expires, httpOnly: true });
        user = {id: user.id, email: user.email, name: user.name, roles: user.roles};
      })
      .catch((err) => {
        // console.error(err);
        user = undefined;
      })

    return user;
}

export async function decrypt(token: string): Promise<User | undefined> {
  let result = undefined;
  jwt.verify(token, process.env.ACCESS_TOKEN as string, (err, decoded) => {
    if (err) {
      result = undefined;
    } else {
      result = decoded as User;
    }
  });
  return result;
}