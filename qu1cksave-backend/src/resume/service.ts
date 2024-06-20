import { Resume, NewResume } from ".";
import { pool } from "../db";
import * as s3 from "./s3";

export class ResumeService {
  public async getOne(id: string): Promise<Resume | undefined> {
    let select = 'SELECT * FROM resume WHERE id = $1';
    const query = {
      text: select,
      values: [id]
    };
    const { rows } = await pool.query(query);

    if (rows.length == 1) {
      try {
        // https://stackoverflow.com/questions/67366381/aws-s3-v3-javascript-sdk-stream-file-from-bucket-getobjectcommand
        //   Examples:
        //   - Convert to base64 string
        //     const streamToString = await data.Body?.transformToString("base64");
        //   - Get a blob
        //     const blob = await data.Body.transformToByteArray();
        // https://github.com/aws/aws-sdk-js-v3/issues/5775
        // https://stackoverflow.com/questions/68373349/aws-sdk-v3-download-file-with-typescript
        //   For node, s3Item.Body is a Readable. In the browser, it is a ReadableStream or Blob (older browsers)
        // https://stackoverflow.com/questions/67879544/nodejs-v3-getobjects-body-attribute-doesnt-include-data-buffer
        //   Poster uses .then to properly console log the response
        // https://stackoverflow.com/questions/36942442/how-to-get-response-from-s3-getobject-in-node-js
        //   Good example of dealing with data as a stream
        // https://stackoverflow.com/questions/23795034/creating-a-blob-or-a-file-from-javascript-binary-string-changes-the-number-of-by
        //   Don't use binary strings

        // Use these resume ids for testing in swagger:
        // 132a76f8-2bbb-e2a4-46c8-386be1fe3d55
        // 2bbb76f8-46c8-e2a4-2bbb-3d55e1fe386b

        const resume = rows[0];

        // TODO: Need a better way of doing this instead of appending .docx, .pdf, etc.
        // MIME Types, Content-Type, and Content-Disposition:
        // - https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        // - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
        // - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
        //   -- Looks like I can use this to trigger a download once the API
        //      call returns a response.
        // TODO:
        //   On upload, how do I get the MIME type of file so I can store it as the mime_type?
        // - https://stackoverflow.com/questions/18299806/how-to-check-file-mime-type-with-javascript-before-upload
        // - https://stackoverflow.com/questions/74031278/how-to-get-actual-mime-type-of-file-loaded-with-html-input-type-file-accept
        // - https://dev.to/victrexx2002/how-to-get-the-mime-type-of-a-file-in-nodejs-p6c
        //
        //  Also, does the MIME type map to one type of extension or not?
        //    Ex. Does application/vnd.openxmlformats-officedocument.wordprocessingml.document
        //        always map to docx?
        //  If not, I should find a way to determine the extension on file upload.
        //
        //  I'll also need to find a way to change the file name into the
        //    original name instead having the UUID as the name upon download.
        //    (NOT THAT BIG OF A PRIORTY)
        //
        // TODO:
        // - Change download/get resume functionality so that the call to s3
        //   is only made upon clicking download (instead of on page load).
        //   -- I'll need to have the ability to automatically download once
        //      the API call returns a response (Look at Content-Disposition
        //      to do this).
        //   -- I'll also need to be able store the blob/uint8array
        //      so I can "cache" it in a React state. So whenever a user
        //      re-downloads this same file, it can just download it from the
        //      cache instead of making another call to s3. (I should put
        //      this cache on layout.tsx)
        //      Note: This cache should update/reset on jobs page reload
        //        and/or adding/updating/deleting a job. In the case of an
        //        update, the update should search the cache for the resume
        //        and update the content accordingly.
        let extension = '';
        switch (resume.mime_type) {
          case 'application/pdf':
            extension = '.pdf';
            break;
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            extension = '.docx';
            break;
          default:
            extension = '.pdf';
        }
        const data = await s3.getObject(rows[0].id + extension);

        if (data && data.Body) {
          // TESTING
          const contentType = data.ContentType;
          const mediaType = contentType?.split(';')[0];
          console.log(`contentType: ${contentType}`);
          console.log(`mediaType: ${mediaType}`);

          const bodyAsByteArray = await data.Body.transformToByteArray();
          // https://stackoverflow.com/questions/49259231/sending-uint8array-bson-in-a-json-object
          // Need to convert byte array to array so it can be put inside a json
          const arr = Array.from(bodyAsByteArray); 
          resume.bytearray_as_array = arr;
          console.log(`length (in service.ts): ${resume.bytearray_as_array.length}`)
        }

        return resume;
      } catch {
        return undefined;
      } 
    }
    return undefined;
  }
}