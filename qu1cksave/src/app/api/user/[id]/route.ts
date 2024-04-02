import { User } from "@/types/user";
// import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get('session')?.value;
  // const token = cookies().get('session')?.value;
  if (!token) {
    return Response.json(undefined);
  }

  const user: User | undefined = await fetch(`http://localhost:3010/api/v0/user/${params.id}`, {
    // method: "GET",
    headers: {
      Authorization: "Bearer " + token,
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
  return Response.json(user);
}