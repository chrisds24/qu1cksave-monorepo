import { Job } from ".";
import { pool } from "../db";

export class JobService {
  public async getMultiple(id?: string): Promise<Job[]> {
    let select = 'SELECT * FROM job';
    if (id) {
      select += ' WHERE member_id = $1';
    }
    const values = id ? [id] : [];
    const query = {
      text: select,
      values: values
    };

    const { rows } = await pool.query(query);
    return rows as Job[];
  }

  public async getOne(id: string): Promise<Job | undefined> {
    let select = 'SELECT * FROM job WHERE id = $1';
    const query = {
      text: select,
      values: [id]
    };

    const { rows } = await pool.query(query);
    return rows.length == 1 ? rows[0] : undefined;
  }
}