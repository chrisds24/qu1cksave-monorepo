import { Job, NewJob } from ".";
import { pool } from "../db";

// No id, member_id, and date_saved since those are unchangeable
const keys = [
  'title', 'company_name', 'job_description', 'notes', 'is_remote', 'country',
  'us_state', 'city', 'date_applied', 'date_posted', 'job_status', 'links', 'found_from'
];

export class JobService {
  public async getMultiple(id?: string): Promise<Job[]> {
    // Job columns
    //   id, member_id, resume_id, title, company_name, job_description, notes, is_remote, country,
    //   us_state, city, date_saved, date_applied, date_posted, job_status, links, found_from
    // Resume columns
    //   id, member_id, job_id, file_name, mime_type

    // Get jobs and include resume data when available
    //
    // ----- Resources ------
    // https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-inner-join/
    // - To get data from another table
    // https://stackoverflow.com/questions/76960675/in-postgres-how-to-join-tables-with-columns-of-the-same-name-and-alter-column-n
    // - Specify which columns to get (Useful when joining tables that have the same column names)
    // https://stackoverflow.com/questions/34163209/postgres-aggregate-two-columns-into-one-item
    // https://stackoverflow.com/questions/35154357/select-columns-into-a-json-from-postgres
    // https://www.postgresql.org/docs/current/functions-json.html
    // - When getting columns, put them into 1 column (The 3 links above are about this topic)
    // https://dba.stackexchange.com/questions/315232/postgresql-join-select-null-if-record-on-one-of-both-table-not-exist
    // https://dba.stackexchange.com/questions/174627/include-null-row-on-join
    // https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-full-outer-join/
    // https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-inner-join/
    // https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-left-join/
    // https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-right-join/
    // https://www.freecodecamp.org/news/sql-join-types-inner-join-vs-outer-join-example
    // Note: To not include nulls: Apply json_strip_nulls to the built object
    let select = `SELECT 
      j.*,
      json_build_object(
        'id', r.id, 
        'member_id', r.member_id,
        'job_id', r.job_id,
        'file_name', r.file_name,
        'mime_type', r.mime_type
      ) AS resume
    FROM 
      job j
      LEFT JOIN resume r ON j.resume_id = r.id AND j.member_id = r.member_id AND j.id = r.job_id`;

    if (id) {
      select += ' WHERE j.member_id = $1';
    }
    const values = id ? [id] : [];
    const query = {
      text: select,
      values: values
    };
    const { rows } = await pool.query(query);

    // Some notes about joining tables, aliases, 
    // 1.) When joining from two tables, those tables can't have the same
    //     column names except for what we're joining on
    //     Ex. We had a join on job.resume_id = resume.resume_id so it's fine
    //     if both have a resume_id column. However, we didn't have a join on
    //     job.member_id and resume.member_id so they both can't have a
    //     member_id.
    //     *** SOLVED using column aliases ***
    //     - In WHERE clause, since I have 2 member_ids (one from job and one
    //       from resume), I need to specify which one I'm using
    // 2.) INNER JOIN filters out returned rows based on
    //     job.resume_id = resume.resume_id. So if a job doesn't have a
    //     resume_id, it won't get returned. I initially thought that they will
    //     and that the join only gets resume data for jobs that have a resume.
    //     Turns out I was wrong.
    // 3.) Find a way to put the columns from the second table into a column
    //     in the first table instead of having those columns take up one
    //     column each.
    //     *** SOLVED using json_build_object

    // FOR TESTING
    // for (const job of rows) {
    //   console.log(`---------- Job ${job.id} ----------`)
    //   for (const key in job) {
    //     console.log(`${key}: ${job[key]}`)
    //     if (key == 'resume') {
    //       const resume = job[key];
    //       console.log('**** Resume ****')
    //       for (const rkey in resume) {
    //         console.log(`${rkey}: ${resume[rkey]}`)
    //       }
    //       console.log('************')
    //     }
    //   }
    // }

    // TODO:
    // 1.) Don't return null columns
    //     *** Try this: I could use json_build_object on the job columns
    //         and the resume (which was built using json_build_object). Then
    //         just call json_strip_nulls on that. (So basically a nested
    //         json_build_object)
    //     *** https://stackoverflow.com/questions/66017080/postgres-create-a-nested-json-object-from-two-json-objects  
    // *** OR I could just simply check the object[key] value intead of just
    //   the key whenever I need to check if a column/attribute exists
    // 2.) If the object returned by json_build_object doesn't have attributes,
    //     don't return the object
    // 3.) Add job_id and member_id as a condition for the join   DONE
    // 4.) Add job_ids to the 2 resume entries I have   DONE

    return rows as Job[];
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