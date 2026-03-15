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

export async function logout() {
  cookies().delete('session');
  redirect('login');
}

// TODO (Firebase): Call the provided Firebase Auth funciton instead
//   Might need to move the logic to where I call signup instead of being
//   inside a server action.
export async function signup(newUser: NewUser): Promise<User | undefined> {
  // const user = await fetch("http://localhost:3010/api/v0/user/signup", {
  // const user = await fetch("https://qu1cksave-backend.onrender.com/api/v0/user/signup", {
  const user = await fetch(`${process.env.BACKEND_URL}/api/v0/user/signup`, {
    method: "POST",
    body: JSON.stringify(newUser),
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .catch((err) => {
      return undefined;
    });
    
  return user;
}

// TODO (Firebase): Don't really need this anymore since I'll use Firebase Auth
//   to decrypt a token.
export async function decrypt(token: string): Promise<User | undefined> {
  let result = undefined;
  // https://www.npmjs.com/package/jsonwebtoken
  // - there are other libraries that expect base64 encoded secrets (random bytes encoded using base64)...
  jwt.verify(token, Buffer.from(process.env.ACCESS_TOKEN as string, 'base64'), (err, decoded) => {
    if (err) {
      result = undefined;
    } else {
      result = decoded as User;
    }
  });
  return result;
}

// TODO (Firebase): Need to redo this since:
// - Firebase rotates and refreshes tokens automatically, so the SDK exposes
//   a method instead of storing a static token property.
// - getIdToken()
//   -- return the current valid ID token
//   -- refresh it automatically if it's expired (~1 hour lifetime)
// - With Firebase Authentication, getIdToken() sometimes makes a network
//   request and sometimes doesn’t. getIdToken() actually:
//   -- Returns cached token immediately if still valid
//   -- Uses refresh token to get a new ID token if expired
// - There's actually config I could use so that I can just
//   do import { auth } from "./firebase", then get the current user and then
//   their token from auth
// - I won't even need this server action
//
//
//
// Needed to get User to show the user's name in jobs page
// - In (main)/layout.tsx, ResponsiveSidebar takes a sessionUser?.name and
//   setSessionUser
// - There's also a <SessionUserFirebaseUidContext.Provider value={ sessionUser?.firebaseUid }>
//   that wraps children.
export async function getSessionUser(): Promise<User | undefined> {
  const session = cookies().get("session")?.value;
  if (session) {
    return await decrypt(session);
  } else {
    return undefined;
  }
}

