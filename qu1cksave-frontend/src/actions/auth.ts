'use server'

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
//   logging into Firebase.
// - If email isn't verified, I need to signOut from Firebase so auth gets
//   cleared. Then tell the user that an email verification has been sent 
export async function setCookie(val: string) {   
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies
  // - According to MDN, maxAge is less error-prone than expires
  //   signInWithEmailAndPassword allows someone to login even if they're
  //   currently logged in to Firebase. Since this is the case, the cookie
  //   expiring after 1 year wouldn't be a problem since they can just log
  //   in again after that time.
  // - Can't really use onAuthStateChanged in my (main) directory which is
  //   protected by Next.js middleware since the middleware will just redirect
  //   away from it (or not even allow access at all) if the cookie is expired
  //   -- However, I can run it in the login page or even the outermost layout
  //      instead, meaning that a user can be logged in from the landing page
  //      like how some web apps do it.
  // - Note that I'm only giving the cookie an arbitrary value since the point
  //   of setting the cookie is for the middleware to be able to tell if
  //   a user is allowed to access authenticated pages or not. This isn't used
  //   for actual authentication since that's what the JWT is for
  // - Naming this "session" is fine as long as no other system in my domain
  //   is trying to use the same cookie name.
  const maxAge = 60 * 60 * 24 * 365; // Expires in 1 year
  cookies().set("session", val, { maxAge: maxAge, httpOnly: true, secure: true, sameSite: 'strict' });
}

// Primary purpose is to delete the cookie used by Next.js middleware
export async function removeCookieAndGoToLoginPage() {
  cookies().delete('session');
  redirect('login');
}
