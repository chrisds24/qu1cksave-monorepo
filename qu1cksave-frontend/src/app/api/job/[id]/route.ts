import { Job } from "@/types/job";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get('session')?.value;
  if (!token) {
    return Response.json(undefined);
  }

  // const job: Job | undefined = await fetch(`http://localhost:3010/api/v0/job/${params.id}`, {
  // const job: Job | undefined = await fetch(`https://qu1cksave-backend.onrender.com/api/v0/job/${params.id}`, {
  const job: Job | undefined = await fetch(`${process.env.BACKEND_URL}/api/v0/job/${params.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${process.env.API_KEY} ${token}`,
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