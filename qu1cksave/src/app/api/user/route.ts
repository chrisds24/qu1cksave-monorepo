import { User } from "@/types/user";
// import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
) {
  const token = request.cookies.get('session')?.value;
  // const token = cookies().get('session')?.value;
  if (!token) {
    return Response.json(undefined);
  }

  const users: User[] | undefined = await fetch(`http://localhost:3010/api/v0/user`, {
    // method: "GET",
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