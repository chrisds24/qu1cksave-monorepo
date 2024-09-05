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
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  // let fetchUrl = 'http://localhost:3010/api/v0/job';
  // let fetchUrl = 'https://qu1cksave-backend.onrender.com/api/v0/job';
  let fetchUrl = `${process.env.BACKEND_URL}/api/v0/job`;
  if (id) {
    fetchUrl += `?id=${id}`;
  }
  const jobs: Job[] | undefined = await fetch(fetchUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY} ${token}`,
    },
  })
    .then((res) => {
      // When the Express API returns undefined, it causes an error since
      //   undefined is not JSON serializable. Though, the
      //   return Response.json(jobs) also causes an error for the same reason.
      if (!res.ok) {
        throw res;
      }
      return res.json()
    })
    .catch((err) => {
      return undefined;
    })
  return Response.json(jobs);
}