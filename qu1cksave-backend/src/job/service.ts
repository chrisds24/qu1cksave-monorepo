import { Resume } from "src/resume";
import { Job, NewJob } from ".";
import { pool } from "../db";
import * as s3 from "../resume/s3";

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
    // https://stackoverflow.com/questions/66017080/postgres-create-a-nested-json-object-from-two-json-objects
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
      LEFT JOIN resume r ON j.resume_id = r.id AND j.member_id = r.member_id`;

    if (id) {
      select += ' WHERE j.member_id = $1';
    }
    const values = id ? [id] : [];
    const query = {
      text: select,
      values: values
    };
    const { rows } = await pool.query(query);

    return rows as Job[];
  }

  public async create(newJob: NewJob, memberId: string): Promise<Job | undefined> {
    // 1.) Add the new resume to the resume table.
    // 2.) Use the returned resume's id as newJob's resume_id
    // 3.) Add the new job to the job table
    // 4.) Add the file to S3
    // 5.) Return the job with resume data attached

    // Add the new resume to the resume table, if there's one
    const newResume = newJob.resume;
    let resume: Resume | undefined = undefined;
    if (newResume) {
      // member_id, job_id?, file_name, mime_type
      const insert = "INSERT INTO resume(member_id, file_name, mime_type) VALUES ($1, $2, $3) RETURNING *";
      const query = {
        text: insert,
        values: [memberId, newResume.file_name, newResume.mime_type],
      };
      try {
        const { rows } = await pool.query(query);
        resume = rows[0];
      } catch {
        console.log('Insert resume unsuccessful');
        return undefined;
      }
    }

    // Add the new job to the job table
    //   id, member_id, title, company_name, job_description, notes, is_remote, country,
    //   us_state, city, date_saved, date_applied, date_posted, job_status, links, found_from
    let txt = 'INSERT INTO job(member_id, ';
    let count = 2;
    let txtVals = 'VALUES ($1, ';
    const vals: any[] = [memberId];
    for (const key in newJob) {     
      if (key === 'resume') continue // Skip resume for now
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
    // Add resume_id to the query here if there was a resume that was added
    if (resume) {
      txt += 'resume_id, ';
      txtVals += `$${count}, `;
      count++;
      vals.push(resume.id);
    }
    // txt.length-2 since we want to remove the final comma and space
    txt = txt.slice(0, txt.length-2) + ') ';
    txtVals = txtVals.slice(0, txtVals.length-2) + ') RETURNING *';

    // Example:
    // const insert =
    //     "INSERT INTO products(cat_id, poster_id, image_id, title, description, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    // What insert looks like when all values are filled:
    // const insert =
    //     "INSERT INTO job(member_id, title, company_name, job_description, notes, is_remote, country, us_state, city, date_applied, date_posted, job_status, links, found_from) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *"
    const insert = txt + txtVals;
    const query = {
      text: insert,
      values: vals,
    };
    let job: Job | undefined = undefined;
    try {
      const { rows } = await pool.query(query);
      job = rows[0];
    } catch {
      // TODO: Need to undo the resume insert into the resume table
      console.log('Insert job unsuccessful.');
      return undefined;
    }

    // If there's a resume, add the file to S3
    if (resume && newResume) {
      job!.resume = resume // Add the resume to the job

      // Make the S3 call to add the resume file
      // const s3Key = s3.getResumeS3Key(resume.id, resume.mime_type)
      try {
        const byteArray = Uint8Array.from(newResume.bytearray_as_array!);
        // await s3.putObject(s3Key, byteArray);
        await s3.putObject(resume.id!, byteArray);
      } catch {
        // TODO: Need to undo add resume and job to database
        console.log('Insert into S3 unsucessful.');
        return undefined;
      }
    }

    return job;
  }

  public async edit(newJob: NewJob, memberId: string, jobId: string): Promise<Job | undefined> {
    // 1.) First, insert, update, or delete the specified resume in the resume table
    // 2.) Either add or remove the resume_id for the specified job in the job table if appropriate
    //     - When updating (or not) a job's resume (when the job already has one), we don't
    //       change its resume_id
    // 3.) Make the S3 call to add, replace, or delete the file from S3
    //     - When adding and replacing, we use putObjectCommand for both
    // 4.) Return the updated job with a resume attached (no file)

    // ------------------- Update resume table -------------------------

    // For EDIT, all go to the PUT route and there's plenty of cases:
    //   The API relies on a combination of a NewResume field in NewJob, a resume_id in NewJob, and the value of keepResume.
    // 1.) No NewResume, no resume_id (Case C.a):
    // -- Job has no resume to edit/remove
    // 2.) No NewResume, has resume_id, keepResume is true (Case A):
    // -- Job has a resume, but we won't edit/remove it
    // 3.) No NewResume, has resume_id, keepResume is false (Case C.b):
    // -- Job has a resume, which we will delete.
    // 4.) Has NewResume, but no resume_id (Case B.a):
    // -- We're adding a resume to the job
    // 5.) Has NewResume and a resume_id (Case B.b):
    // -- We're editing the resume specified by resume_id
    //
    // ----- When returning the job -----
    // For 1, we don't have a resume to attach
    // For 2, we still need to get the resume from the resume table so we
    //   can attach it to the job.
    // For 3, we don't attach a resume to the job
    // For 4 and 5, we also get the resume from the table and attach it to the job
    
    const newResume = newJob.resume;
    const resumeId = newJob.resume_id;
    // resume is used later to decide if we're adding or removing a resume_id from a job
    //   Will also get attached to the the job we're returning from the API call
    let resume: Resume | undefined = undefined;
    let action: string | undefined = undefined; // 'put', 'delete', or undefined
    // newJob does not have a resume field, so we're either keeping or deleting an existing one
    //   or there isn't a resume in the first place
    if (!newResume) {
      // Case 1: When newJob doesn't have a resume_id, the job doesn't have a resume in the first place
      //   Don't have a resume to attach
      // Otherwise, we're either keeping or deleting the current one
      if (resumeId) { 
        // Case 2: If we're keeping the old resume, there's nothing to do
        //   Still need to attach a resume, so we need to get it from the table
        if (newJob.keepResume) {
          // SELECT from resume table
          let select = 'SELECT * FROM resume WHERE id = $1 AND member_id = $2';
          const query = {
            text: select,
            values: [resumeId, memberId]
          };
          try {
            const { rows } = await pool.query(query);
            resume = rows[0];
          } catch {
            console.log('Select resume unsuccessful');
            return undefined;
          }
        } else {
          // Case 3: Otherwise, we delete the current one
          //   We don't have a resume to attach to the job
          // DELETE from resume table
          const remove = "DELETE FROM resume WHERE id = $1 AND member_id = $2 RETURNING *";
          const query = {
            text: remove,
            values: [resumeId, memberId],
          };
          try {
            await pool.query(query);
            // resume stays undefined
            action = 'delete';
          } catch {
            console.log('Delete resume unsuccessful');
            return undefined;
          }
        }
      }
    } else {
      // This ELSE branch is for Cases 4 and 5
      //   newJob has a resume field, so we're either adding a resume to the job or editing an existing one
      //   We can just attach the resume returned here to the job
      if (!resumeId) {
        // Case 4
        // INSERT into resume table
        const insert = "INSERT INTO resume(member_id, file_name, mime_type) VALUES ($1, $2, $3) RETURNING *";
        const query = {
          text: insert,
          values: [memberId, newResume.file_name, newResume.mime_type],
        };
        try {
          const { rows } = await pool.query(query);
          resume = rows[0];
          action = 'put';
        } catch {
          console.log('Insert resume unsuccessful');
          return undefined;
        }
      } else {
        // Case 5
        // UPDATE resume table
        // id, member_id, job_id, file_name, mime_type, bytearray_as_array   Resume properties
        const update = 'UPDATE resume SET file_name = $1, mime_type = $2 WHERE id = $3 AND member_id = $4 RETURNING *'
        const query = {
          text: update,
          values: [newResume.file_name, newResume.mime_type, resumeId, memberId],
        };
        try {
          const { rows } = await pool.query(query);
          resume = rows[0];
          action = 'put';
        } catch {
          console.log('Update resume unsuccessful');
          return undefined;
        }
      }
    }

    // ------------------- Update job table -------------------------
    // Update example:
    //   UPDATE resume SET file_name = $1, mime_type = $2 WHERE id = $3 AND member_id = $4 RETURNING *

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

    // Update resume_id
    // - 1st case is when we're adding/updating a job's resume and also when
    //   we're keeping a job's resume and not changing it. In the case of
    //   an update and when keeping the original resume, there's no actual
    //   change to resume_id.
    //   (Cases 2, 4, and 5 above)
    // - 2nd case is when we're deleting a resume or when the job doesn't have
    //   a resume in the first place. In the case that the job doesn't have a
    //   resume, setting resume_id to NULL still works.
    //   (Cases 1 and 3 above)
    if (resume) {
      txt += `resume_id = $${count}, `;
      count++;
      vals.push(resume.id);
    } else {
      txt +=  'resume_id = NULL, ';
    }

    // Remove the final comma and space then add remaining part of the query
    txt = txt.slice(0, txt.length-2) + ` WHERE id = $${count} AND member_id = $${count + 1} RETURNING *`;
    vals.push(jobId);
    vals.push(memberId);
    
    let job: Job | undefined = undefined;
    const query = {
      text: txt,
      values: vals,
    };
    try {
      const { rows } = await pool.query(query);
      job = rows[0];
    } catch {
      // TODO: Undo the change to the resume table;
      console.log('Update job unsuccessful');
      return undefined;
    }

    // -------------------- Make S3 call -------------------

    // IMPORTANT: When making s3 calls, I probably shouldn't include the extension
    //   But only do this if you're able to upload and have the key just be the UUID

    // Make the S3 call to add the resume file
    //   No s3 action to take for Cases 1 and 2 (no resume or didn't change resume)
    if (resume) {
      // There is a resume for Cases 2, 4, and 5
      //   Attach the resume if we didn't change it, we added one to a job, or updated an existing one
      //   We don't attach anything if there wasn't one or we deleted one (Cases 1 and 3)
      job!.resume = resume; // Attach the resume to the job

      // Cases 4 and 5
      if (action === 'put') { // We're either adding or replacing a file
        // const s3Key = s3.getResumeS3Key(resume.id!, resume.mime_type!)
        try {
          const byteArray = Uint8Array.from(newResume!.bytearray_as_array!);
          // await s3.putObject(s3Key, byteArray);
          await s3.putObject(resume.id!, byteArray);
        } catch {
          // TODO: Need to undo add resume and job to database
          console.log('Insert into S3 unsucessful.');
          return undefined;
        }
      }
    } else { // There is no resume for Cases 1 (no resume) and 3 (delete)
      if (action === 'delete') { // Case 3 (delete)
        try {
          await s3.deleteObject(resumeId!);
        } catch {
          // TODO: Need to undo add resume and job to database
          console.log('Delete from S3 unsucessful.');
          return undefined;
        }
      }
    }

    // TODO: Test adding a resume to s3 without an extension

    return job;
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