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

  // const resume: Resume | undefined = await fetch(`http://localhost:3010/api/v0/resume/${params.id}`, {
  // const resume: Resume | undefined = await fetch(`https://qu1cksave-backend.onrender.com/api/v0/resume/${params.id}`, {
  const resume: Resume | undefined = await fetch(`${process.env.BACKEND_URL}/api/v0/resume/${params.id}`, {
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

    // // NOTE: If using Content-Disposition to automatically download.
    // // Convert to bytearray then to blob, then return a new response.
    // // https://developer.mozilla.org/en-US/docs/Web/API/Headers/set
    // // https://nextjs.org/docs/app/building-your-application/routing/route-handlers
    // return new Response(blob, {
    //   status: 200,
    //   headers: {
    //     'Content-Type': resume.mime_type!,
    //     'Content-Disposition': `attachment; filename="${resume.file_name}"`
    //   },
    // });

  return Response.json(resume);
}