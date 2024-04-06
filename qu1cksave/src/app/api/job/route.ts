import { decrypt } from "@/actions/auth";
import { Job } from "@/types/job";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
) {
  const token = request.cookies.get('session')?.value;
  if (!token) {
    return Response.json(undefined);
  }

  // Get the user's id
  // Method 1:
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  // // Method 2: From session
  // const user = await decrypt(token);
  // if (!user) {
  //   return Response.json(undefined);
  // }
  // const id = user.id;

  // let fetchUrl = 'http://localhost:3010/api/v0/job';
  // if (id) {
  //   fetchUrl += `?id=${id}`;
  // }
  // const users: Job[] | undefined = await fetch(fetchUrl, {
  const users: Job[] | undefined = await fetch(`http://localhost:3010/api/v0/job?id=${id}`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json()
    })
    .catch((err) => {
      return undefined;
    })
  return Response.json(users);
}