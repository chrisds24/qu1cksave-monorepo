import { Resume } from "@/types/resume";
import { headers } from "next/headers";
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

    // // NOTE: If using Content-Disposition to automatically download.
    // // https://developer.mozilla.org/en-US/docs/Web/API/Headers/set
    // // Convert the array into a byte array
    // const byteArray = Uint8Array.from(resume.bytearray_as_array!);
    // // https://stackoverflow.com/questions/74401312/javascript-convert-binary-string-to-blob
    // const blob = new Blob([byteArray], {type: resume.mime_type!});
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

// LOG res properties
// // bodyUsed, ok, redirected, status, statusText, type, url
// console.log(`res.bodyUsed: ${res.bodyUsed}`)
// console.log(`res.ok: ${res.ok}`)
// console.log(`res.redirected: ${res.redirected}`)
// console.log(`res.status: ${res.status}`)
// console.log(`res.statusText: ${res.statusText}`)
// console.log(`res.type: ${res.type}`)
// console.log(`res.url: ${res.url}`)
// console.log('-------------------');
// const headers = res.headers;
// console.log(`res.headers(route.ts): ${headers}`);
// for (const key in headers) {
//   console.log(`${key}: ${headers.get(key)}`);
// }
// console.log('-------------------');