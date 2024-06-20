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
        // const data = await s3.getObject(rows[0].id + '.docx');
        const data = await s3.getObject(rows[0].id + '.pdf');

        if (data && data.Body) {
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