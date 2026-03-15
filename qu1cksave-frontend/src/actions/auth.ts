'use server'

import { Credentials, NewUser } from "@/types/auth";
import { User } from "@/types/user";
import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// TODO (Firebase): Call the provided Firebase Auth funciton instead
//   Might need to move the logic to where I call login instead of being
//   inside a server action.
// IMPORTANT: It's still important to set the cookie upon a login.
// - When logging in via Firebase successfully: Set the cookie
// - If successful going to my backend, keep the cookie.
// - If not successful (Ex. email not verified or not a valid token),
//   need to remove the cookie.
// - Remember, I also need to add a check to email verified after successfully
//   logging into Firebase
export async function login(credentials: Credentials): Promise<User | undefined> {    
  const user = await fetch(`${process.env.BACKEND_URL}/api/v0/user/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      // Spring Boot API returns null with a non 200 range status code if
      //   something goes wrong, including when the user can't be found, which
      //   triggers the catch block
      if (!res.ok) {
        throw res;
      }
      // If res body is undefined, res.json() causes an error
      return res.json();
    })
    .then((user) => {
      const expires = new Date(Date.now() + 2*60*60*1000); // Expires in 2 hours
      // Switch to this once using https
      cookies().set("session", user.access_token, { expires, httpOnly: true, secure: true, sameSite: 'strict' });
      return {id: user.id, email: user.email, name: user.name, roles: user.roles};
    })
    .catch((err) => {
      return undefined
    })

  return user;
}

// Primary purpose is to delete the cookie used by Next.js middleware
export async function logout() {
  cookies().delete('session');
  redirect('login');
}
