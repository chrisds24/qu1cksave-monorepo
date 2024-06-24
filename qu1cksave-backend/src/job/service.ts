import { Job, NewJob } from ".";
import { pool } from "../db";

// No id, member_id, and date_saved since those are unchangeable
const keys = [
  'title', 'company_name', 'job_description', 'notes', 'is_remote', 'country',
  'us_state', 'city', 'date_applied', 'date_posted', 'job_status', 'links', 'found_from'
];

export class JobService {
  public async getMultiple(id?: string): Promise<Job[]> {
    // let select = 'SELECT * FROM job';
    let select = 'SELECT * FROM job INNER JOIN resume ON job.resume_id = resume.resume_id';
    if (id) {
      select += ' WHERE member_id = $1';
    }
    const values = id ? [id] : [];
    const query = {
      text: select,
      values: values
    };
    const { rows } = await pool.query(query);

    // Things I learned about INNER JOIN:
    // 1.) When joining from two tables, those tables can't have the same
    //     column names except for what we're joining on
    //     Ex. We had a join on job.resume_id = resume.resume_id so it's fine
    //     if both have a resume_id column. However, we didn't have a join on
    //     job.member_id and resume.member_id so they both can't have a
    //     member_id.
    // 2.) INNER JOIN filters out returned rows based on
    //     job.resume_id = resume.resume_id. So if a job doesn't have a
    //     resume_id, it won't get returned. I initially thought that they will
    //     and that the join only gets resume data for jobs that have a resume.
    //     Turns out I was wrong.
    // TODO:
    // 1.) Search about using JOIN, INNER JOIN, etc. when tables have the same
    //     column names (So I don't have to change the column names for resume)
    // 2.) Find a way so INNER JOIN returns jobs that don't have a resume_id.
    // 3.) Find a way to put the columns from the second table into a column
    //     in the first table instead of having those columns take up one
    //     column each.

    const jobs = [];
    for (const job of rows) {
      console.log(`---------- Job ${job.id} ----------`)
      for (const key in job) {
        console.log(`${key}: ${job[key]}`)
      }
    }

    // return rows as Job[];
    return [] as Job[];
  }

  public async create(newJob: NewJob, memberId: string): Promise<Job | undefined> {
    // id, member_id, title, company_name, job_description, notes, is_remote, country,
    // us_state, city, date_saved, date_applied, date_posted, job_status, links, found_from
    let txt = 'INSERT INTO job(member_id, ';
    let count = 2;
    let txtVals = 'VALUES ($1, ';
    const vals: any[] = [memberId];
    for (const key in newJob) {
      txt += `${key}, `;
      txtVals += `$${count}, `;
      count++;

      // I used: https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b
      // Alternative: https://stackoverflow.com/questions/75050320/typescript-error-element-implicitly-has-an-any-type-because-expression-of-ty
      vals.push(
        key === 'links' || key === 'date_applied' || key === 'date_posted' ?
        JSON.stringify(newJob[key as keyof typeof newJob]) :
        newJob[key as keyof typeof newJob]
      )
    }
    // txt.length-2 since we want to remove the final comma and space
    txt = txt.slice(0, txt.length-2) + ') ';
    txtVals = txtVals.slice(0, txtVals.length-2) + ') RETURNING *';

    // Example:
    // const insert =
    //     "INSERT INTO products(cat_id, poster_id, image_id, title, description, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const insert = txt + txtVals;
    // insert when all values are filled
    // const insert =
    //     "INSERT INTO job(member_id, title, company_name, job_description, notes, is_remote, country, us_state, city, date_applied, date_posted, job_status, links, found_from) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *"
    const query = {
      text: insert,
      values: vals,
    };
    try {
      const { rows } = await pool.query(query);
      return rows[0];
    } catch(e) {
      console.log(e);
      return undefined;
    }
  }

  public async edit(newJob: NewJob, memberId: string, jobId: string): Promise<Job | undefined> {
    // 'title', 'company_name', 'job_description', 'notes', 'is_remote', 'country',
    // 'us_state', 'city', 'date_applied', 'date_posted', 'job_status', 'links', 'found_from'
    let txt = 'UPDATE job SET ';
    let count = 1;
    const vals: any[] = [];
    for (const key of keys) {
      if (key in newJob) {
        txt += `${key} = $${count}, `;
        count++;
        vals.push(
          key === 'links' || key === 'date_applied' || key === 'date_posted' ?
          JSON.stringify(newJob[key as keyof typeof newJob]) :
          newJob[key as keyof typeof newJob]        
        );
      } else {
        txt +=  `${key} = NULL, `;
      }
    }
    // Remove the final comma and space then add remaining part of the query
    txt = txt.slice(0, txt.length-2) + ` WHERE id = $${count} AND member_id = $${count + 1} RETURNING *`;
    vals.push(jobId);
    vals.push(memberId);
    
    const query = {
      text: txt,
      values: vals,
    };
    try {
      const { rows } = await pool.query(query);
      return rows[0];
    } catch(e) {
      console.log(e);
      return undefined;
    }
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