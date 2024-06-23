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
        // Use these resume ids for testing in swagger:
        // 132a76f8-2bbb-e2a4-46c8-386be1fe3d55
        // 2bbb76f8-46c8-e2a4-2bbb-3d55e1fe386b

        const resume = rows[0];

        // TODO: Need a better way of doing this instead of appending .docx, .pdf, etc.
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
          const bodyAsByteArray = await data.Body.transformToByteArray();
          // https://stackoverflow.com/questions/49259231/sending-uint8array-bson-in-a-json-object
          // Need to convert byte array to array so it can be put inside a json
          const arr = Array.from(bodyAsByteArray); 
          resume.bytearray_as_array = arr;
        }

        return resume;
      } catch {
        return undefined;
      } 
    }
    return undefined;
  }
}