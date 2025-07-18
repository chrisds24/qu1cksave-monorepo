import { CoverLetter } from ".";
import { pool } from "../db";
import * as s3 from "../s3/s3";

export class CoverLetterService {
  public async getOne(id: string, memberId: string): Promise<CoverLetter | undefined> {
    let select = 'SELECT * FROM cover_letter WHERE id = $1 AND member_id = $2';
    const query = {
      text: select,
      // text: 'Bad query',
      values: [id, memberId]
    };

    try {
      const { rows } = await pool.query(query);

      if (rows.length == 1) {
        const coverLetter = rows[0];
        const data = await s3.getObject(coverLetter.id);
  
        if (data && data.Body) {
          const bodyAsByteArray = await data.Body.transformToByteArray();
          // https://stackoverflow.com/questions/49259231/sending-uint8array-bson-in-a-json-object
          // Need to convert byte array to array so it can be put inside a json
          const arr = Array.from(bodyAsByteArray); 
          coverLetter.byte_array_as_array = arr;
          // Return the coverLetter data along with the file.
          // - Will need data to convert to correct type, restore name, etc.
          return coverLetter;
        } else {
          return undefined;
        }
      }
    } catch {
      return undefined;
    }
  }
}