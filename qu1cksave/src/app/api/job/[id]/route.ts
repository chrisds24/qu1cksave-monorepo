import { Job } from "@/types/job";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get('session')?.value;
  if (!token) {
    return Response.json(undefined);
  }

  // https://github.com/vercel/next.js/discussions/46483
  const newJob = await request.json();

  const job: Job | undefined = await fetch(`http://localhost:3010/api/v0/job/${params.id}`, {
    method: "PUT",
    body: JSON.stringify(newJob),
    headers: {
      Authorization: 'Bearer ' + token,
      "Content-Type": "application/json",
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
  return Response.json(job);
}