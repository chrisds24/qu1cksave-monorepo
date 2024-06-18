import { Resume, NewResume } from ".";
import { pool } from "../db";
import * as s3 from "./s3";

export class ResumeService {
  // TODO: REMOVE THIS LATER
  public async getMultiple(id?: string): Promise<Resume[]> {
    let select = 'SELECT * FROM resume';
    if (id) {
      select += ' WHERE member_id = $1';
    }
    const values = id ? [id] : [];
    const query = {
      text: select,
      values: values
    };

    const { rows } = await pool.query(query);
    return rows as Resume[];
  }

  public async getOne(id: string): Promise<Resume | undefined> {
    let select = 'SELECT * FROM resume WHERE id = $1';
    const query = {
      text: select,
      values: [id]
    };

    const { rows } = await pool.query(query);
    if (rows.length == 1) {
      try {
        const s3Object = await s3.getObject(rows[0].id + '.docx');
        const resume = rows[0];
        return resume
      } catch {
        return undefined;
      } 
    }
    return undefined;
  }
}