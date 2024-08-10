import { User } from "@/types/user";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
) {
  const token = request.cookies.get('session')?.value;
  if (!token) {
    return Response.json(undefined);
  }

  // const users: User[] | undefined = await fetch(`http://localhost:3010/api/v0/user`, {
  const users: User[] | undefined = await fetch(`https://qu1cksave-backend.onrender.com/api/v0/user`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((res) => {
      if (!res.ok) { // Error
        throw res;
      }
      return res.json() // Collection exists(could be empty)
    })
    .catch((err) => {
      return undefined;
    })
  return Response.json(users);
}