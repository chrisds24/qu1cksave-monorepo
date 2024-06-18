import { Resume, NewResume } from ".";
import { pool } from "../db";

export class ResumeService {
  public async getOne(id: string): Promise<Resume | undefined> {
    let select = 'SELECT * FROM resume WHERE id = $1';
    const query = {
      text: select,
      values: [id]
    };

    const { rows } = await pool.query(query);
    if (rows.length == 1) {
      // rows[0]
    }
    return undefined;
  }
}