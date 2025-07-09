'use server'

import { Credentials, NewUser } from "@/types/auth";
import { User } from "@/types/user";
import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(credentials: Credentials): Promise<User | undefined> {    
  // const user = await fetch("http://localhost:3010/api/v0/user/login", {
  // const user = await fetch("https://qu1cksave-backend.onrender.com/api/v0/user/login", {
  const user = await fetch(`${process.env.BACKEND_URL}/api/v0/user/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
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

// Needed to get User to show the user's name in jobs page
export async function getSessionUser(): Promise<User | undefined> {
  const session = cookies().get("session")?.value;
  if (session) {
    return await decrypt(session);
  } else {
    return undefined;
  }
}

