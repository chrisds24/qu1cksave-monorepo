import { Resume, NewResume } from ".";
import { pool } from "../db";
import * as s3 from "./s3";

export class ResumeService {
  public async getOne(id: string, memberId: string): Promise<Resume | undefined> {
    let select = 'SELECT * FROM resume WHERE id = $1 AND member_id = $2';
    const query = {
      text: select,
      values: [id, memberId]
    };
    const { rows } = await pool.query(query);

    if (rows.length == 1) {
      try {
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
        const data = await s3.getObject(resume.id + extension);

        if (data && data.Body) {
          const bodyAsByteArray = await data.Body.transformToByteArray();
          // https://stackoverflow.com/questions/49259231/sending-uint8array-bson-in-a-json-object
          // Need to convert byte array to array so it can be put inside a json
          const arr = Array.from(bodyAsByteArray); 
          resume.bytearray_as_array = arr;
          // Return the resume data along with the file.
          // - Will need data to convert to correct type, restore name, etc.
          return resume;
        } else {
          return undefined;
        }
      } catch {
        return undefined;
      } 
    }
    return undefined;
  }
}