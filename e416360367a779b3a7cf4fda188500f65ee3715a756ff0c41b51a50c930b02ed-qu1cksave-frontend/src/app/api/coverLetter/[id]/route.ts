import { CoverLetter } from "@/types/coverLetter";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get('session')?.value;
  if (!token) {
    return Response.json(undefined);
  }

  // const coverLetter: CoverLetter | undefined = await fetch(`http://localhost:3010/api/v0/coverLetter/${params.id}`, {
  // const coverLetter: CoverLetter | undefined = await fetch(`https://qu1cksave-backend.onrender.com/api/v0/coverLetter/${params.id}`, {
  const coverLetter: CoverLetter | undefined = await fetch(`${process.env.BACKEND_URL}/api/v0/coverLetter/${params.id}`, {
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

  return Response.json(coverLetter);
}