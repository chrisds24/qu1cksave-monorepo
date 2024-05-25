import { Job, NewJob } from ".";
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

  public async create(newJob: NewJob, memberId: string): Promise<Job> {
    // id, member_id, title, company_name, job_description, notes, is_remote, country,
    // us_state, city, date_saved, date_applied, date_posted, job_status, links, found_from
    let txt = 'INSERT INTO job(member_id,';
    let count = 2;
    let txtVals = 'VALUES ($1,';
    const vals = [memberId];
    for (const key in newJob) {
      txt += `${key},`;
      txtVals += `$${count},`;
      count++;
      vals.push(key)
    }
    // txt.length-1 since we want to remove the final comma
    txt = txt.slice(0, txt.length-1) + ') '
    txtVals = txtVals.slice(0, txtVals.length-1) + ') RETURNING *'

    // Example:
    // const insert =
    //   "INSERT INTO job(cat_id, poster_id, image_id, title, description, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const insert = txt + txtVals;
    const query = {
      text: insert,
      values: [vals],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  // public async getOne(id: string): Promise<Job | undefined> {
  //   let select = 'SELECT * FROM job WHERE id = $1';
  //   const query = {
  //     text: select,
  //     values: [id]
  //   };

  //   const { rows } = await pool.query(query);
  //   return rows.length == 1 ? rows[0] : undefined;
  // }
}