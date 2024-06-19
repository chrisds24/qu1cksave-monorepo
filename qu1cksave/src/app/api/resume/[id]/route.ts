import { Resume } from "@/types/resume";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get('session')?.value;
  if (!token) {
    return Response.json(undefined);
  }

  const resume: Resume | undefined = await fetch(`http://localhost:3010/api/v0/resume/${params.id}`, {
    // method: "GET",
    headers: {
      Authorization: "Bearer " + token,
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
    })
  return Response.json(resume);
}