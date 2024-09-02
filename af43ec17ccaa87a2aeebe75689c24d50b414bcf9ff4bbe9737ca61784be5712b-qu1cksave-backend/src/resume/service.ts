import { Resume } from ".";
import { pool } from "../db";
import * as s3 from "../s3/s3";

export class ResumeService {
  public async getOne(id: string, memberId: string): Promise<Resume | undefined> {
    let select = 'SELECT * FROM resume WHERE id = $1 AND member_id = $2';
    const query = {
      text: select,
      // text: 'Bad query',
      values: [id, memberId]
    };

    try {
      const { rows } = await pool.query(query);

      if (rows.length == 1) { // If resume exists
        const resume = rows[0];
        // const s3Key = s3.getResumeS3Key(resume.id, resume.mime_type);
        // const data = await s3.getObject(s3Key);
        const data = await s3.getObject(resume.id);
  
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
      } else {
        return undefined;
      }
    } catch {
      return undefined;
    }
  }
}