import { Resume } from "src/resume";
import { Job, NewJob } from ".";
import { pool } from "../db";
import * as s3 from "../s3/s3";
import { CoverLetter } from "src/coverLetter";

// No id, member_id, and date_saved since those are unchangeable
const keys = [
  'title', 'company_name', 'job_description', 'notes', 'is_remote',
  'salary_min', 'salary_max', 'country', 'us_state', 'city', 'date_applied',
  'date_posted', 'job_status', 'links', 'found_from'
];

export class JobService {
  public async getMultiple(id?: string): Promise<Job[] | undefined> {
    // Job columns
    //   id, member_id, resume_id, title, company_name, job_description, notes, is_remote, country,
    //   us_state, city, date_saved, date_applied, date_posted, job_status, links, found_from
    // Resume columns
    //   id, member_id, file_name, mime_type

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
        'file_name', r.file_name,
        'mime_type', r.mime_type
      ) AS resume,
      json_build_object(
        'id', c.id, 
        'member_id', c.member_id,
        'file_name', c.file_name,
        'mime_type', c.mime_type
      ) AS cover_letter      
    FROM 
      job j
      LEFT JOIN resume r ON j.resume_id = r.id AND j.member_id = r.member_id
      LEFT JOIN cover_letter c ON j.cover_letter_id = c.id AND j.member_id = c.member_id`;
      
    // let select = 'Bad query'; // TESTING

    if (id) {
      select += ' WHERE j.member_id = $1';
    }
    const values = id ? [id] : [];
    const query = {
      text: select,
      values: values
    };
    try {
      const { rows } = await pool.query(query);
      return rows as Job[];
    } catch {
      return undefined; // TODO: Instead of undefined, return a proper error json
    }
  }

  public async create(newJob: NewJob, memberId: string): Promise<Job | undefined> {
    // 1.) Add the new resume to the resume table.
    // 2.) Use the returned resume's id as newJob's resume_id
    // 3.) Add the new job to the job table
    // 4.) Add the file to S3
    // 5.) Return the job with resume data attached
    // NOTE: Do the same for cover letters

    // Add the new resume to the resume table, if there's one
    const newResume = newJob.resume;
    let resume: Resume | undefined = undefined;
    if (newResume) {
      // member_id, file_name, mime_type
      const insert = "INSERT INTO resume(member_id, file_name, mime_type) VALUES ($1, $2, $3) RETURNING *";
      const query = {
        text: insert,
        values: [memberId, newResume.file_name, newResume.mime_type],
      };
      try {
        const { rows } = await pool.query(query);
        resume = rows[0];
      } catch {
        // console.log('Insert resume unsuccessful');
        return undefined;
      }
    }

    // Add the new coverLetter to the coverLetter table, if there's one
    const newCoverLetter = newJob.cover_letter;
    let coverLetter: CoverLetter | undefined = undefined;
    if (newCoverLetter) {
      // member_id, file_name, mime_type
      const insert = "INSERT INTO cover_letter(member_id, file_name, mime_type) VALUES ($1, $2, $3) RETURNING *";
      const query = {
        text: insert,
        values: [memberId, newCoverLetter.file_name, newCoverLetter.mime_type],
      };
      try {
        const { rows } = await pool.query(query);
        coverLetter = rows[0];
      } catch {
        // TODO: Need to undo insert resume into job table
        console.log('Insert coverLetter unsuccessful');
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
      if (key === 'cover_letter') continue // Skip cover letter for now
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
    // Add cover_letter_id to the query here if there was a cover letter that was added
    if (coverLetter) {
      txt += 'cover_letter_id, ';
      txtVals += `$${count}, `;
      count++;
      vals.push(coverLetter.id);
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
      // text: 'Bad query', // TESTING
      values: vals,
    };
    let job: Job | undefined = undefined;
    try {
      const { rows } = await pool.query(query);
      job = rows[0];
    } catch {
      // TODO: Need to undo the resume and cover letter inserts into the resume/cover letter tables
      // console.log('Insert job unsuccessful.');
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
        // TODO: Need to undo add resume, cover letter, and job to database
        // console.log('Insert resume file into S3 unsucessful.');
        return undefined;
      }
    }

    // If there's a cover letter, add the file to S3
    if (coverLetter && newCoverLetter) {
      job!.cover_letter = coverLetter // Add the cover letter to the job

      // Make the S3 call to add the cover letter file
      try {
        const byteArray = Uint8Array.from(newCoverLetter.bytearray_as_array!);
        await s3.putObject(coverLetter.id!, byteArray);
      } catch {
        // TODO: Need to undo add resume, cover letter, and job to database
        // console.log('Insert cover letter file into S3 unsucessful.');
        return undefined;
      }
    }

    return job;
  }

  public async edit(newJob: NewJob, memberId: string, jobId: string): Promise<Job | undefined> {
    // 1.) Get the job to ensure that we're using the updated resume_id from
    //     the database.
    //     - Need to do this, since stale resume data could cause
    //       inconsistencies in data.
    // 2.) Select, insert, update, or delete from resume table
    // 3.) Update job, including the resume_id, in job table
    // 4.) Make call to S3 add, replace, or delete a resume file
    // 5.) Return the job, attaching the resume when appropriate
    // *** Do the same for cover letters

    // ------------------- Get the job from the database -------------------------
    let resumeId;
    let coverLetterId;

    let select = 'SELECT * FROM job WHERE id = $1 AND member_id = $2';
    const q = {
      text: select,
      values: [jobId, memberId]
    };
    try {
      const { rows } = await pool.query(q);
      resumeId = rows[0].resume_id;
      coverLetterId = rows[0].cover_letter_id
    } catch {
      // console.log('Select job unsuccessful');
      // If job can't be found, we should return an error since we can't edit
      //   a job that doesn't exist.
      return undefined;
    }

    // NOTE: We're using the resume_id of the job from the database instead of
    //   the job passed from the frontend since the frontend job could have
    //   stale resume data. (Same idea applies to cover letters)
    
    // If a request to edit this job contains a resume_id but the actual job
    //   in the database does not (because of stale frontend data), we need to
    //   terminate the request since we could be attempting to edit a resume
    //   that doesn't exist. (Same idea applies to cover letters)
    if ((newJob.resume_id && !resumeId) || (newJob.cover_letter_id && !coverLetterId)) {
      // console.log('Error. Attempting to edit resume/cover letter that does not exist.')
      return undefined;
    }

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
    const newResume = newJob.resume;
    // const resumeId = newJob.resume_id;
    let resume: Resume | undefined = undefined;
    let resumeAction: string | undefined = undefined; // 'put', 'delete', or undefined

    if (!newResume) { // Cases 1, 2, and 3
      // Case 1: When newJob doesn't have a resume_id, the job doesn't have a resume in the first place
      if (resumeId) { // Cases 2 and 3
        // console.log(`newJob has no newResume, but has a resume_id.`)
        if (newJob.keep_resume) {
          // Case 2: Keep the resume given the resumeId. Need to select it using the given id     
          // SELECT from resume table. Attach this resume later.
          // console.log(`newJob has keepResume as TRUE.`)
          // console.log(`Case 2: Didn't edit existing resume.`)

          let select = 'SELECT * FROM resume WHERE id = $1 AND member_id = $2';
          const query = {
            text: select,
            values: [resumeId, memberId]
          };
          try {
            const { rows } = await pool.query(query);
            resume = rows[0];
          } catch {
            // console.log('Select resume unsuccessful');
            return undefined;
          }
        } else {
          // Case 3: Delete resume given the resumeId
          // DELETE from resume table. No resume to attach.
          // console.log(`newJob has keepResume as FALSE.`)
          // console.log(`Case 3: Deleting existing resume.`)

          const remove = "DELETE FROM resume WHERE id = $1 AND member_id = $2 RETURNING *";
          const query = {
            text: remove,
            values: [resumeId, memberId],
          };
          try {
            await pool.query(query);
            // resume stays undefined
            resumeAction = 'delete';
          } catch {
            // console.log('Delete resume unsuccessful');
            return undefined;
          }
        }
      } else { // Just here to console log Case 1
        // console.log(`newJob has no newResume and no resume_id.`)
        // console.log(`Case 1: No resume to edit or remove.`)
      }
    } else { // Cases 4 and 5
      // For both cases, need to attach a resume to the job later
      if (!resumeId) {
        // Case 4: Add new resume
        // INSERT into resume table
        // console.log(`newJob has a newResume, but no resume_id.`)
        // console.log(`Case 4: Adding newResume into resume table. Attach this later`)

        const insert = "INSERT INTO resume(member_id, file_name, mime_type) VALUES ($1, $2, $3) RETURNING *";
        const query = {
          text: insert,
          values: [memberId, newResume.file_name, newResume.mime_type],
        };
        try {
          const { rows } = await pool.query(query);
          resume = rows[0];
          resumeAction = 'put';
        } catch {
          // console.log('Insert resume unsuccessful');
          return undefined;
        }
      } else {
        // Case 5: Update existing resume
        // UPDATE resume table
        // console.log(`newJob has a newResume and also has a resume_id.`)
        // console.log(`Case 5: Updating an existing resume in the resume table. Attach this later`)

        // id, member_id file_name, mime_type, bytearray_as_array   (Resume properties)
        const update = 'UPDATE resume SET file_name = $1, mime_type = $2 WHERE id = $3 AND member_id = $4 RETURNING *'
        const query = {
          text: update,
          values: [newResume.file_name, newResume.mime_type, resumeId, memberId],
        };
        try {
          const { rows } = await pool.query(query);
          resume = rows[0];
          resumeAction = 'put';
        } catch {
          // console.log('Update resume unsuccessful');
          return undefined;
        }
      }
    }

    // ------------------- Update cover letter table --------------------
    // TODO: If there's an error, undo change to the resume table
    const newCoverLetter = newJob.cover_letter;
    // const coverLetterId = newJob.cover_letter_id;
    let coverLetter: CoverLetter | undefined = undefined;
    let coverLetterAction: string | undefined = undefined; // 'put', 'delete', or undefined

    if (!newCoverLetter) { // Cases 1, 2, and 3
      // Case 1
      if (coverLetterId) { // Cases 2 and 3
        // console.log(`newJob has no newCoverLetter, but has a cover_letter_id.`)
        if (newJob.keep_cover_letter) {
          // Case 2     
          // SELECT from cover_letter table. Attach this cover_letter later.
          // console.log(`newJob has keepCoverLetter as TRUE.`)
          // console.log(`Case 2: Didn't edit existing cover_letter.`)

          let select = 'SELECT * FROM cover_letter WHERE id = $1 AND member_id = $2';
          const query = {
            text: select,
            values: [coverLetterId, memberId]
          };
          try {
            const { rows } = await pool.query(query);
            coverLetter = rows[0];
          } catch {
            // console.log('Select cover letter unsuccessful');
            return undefined;
          }
        } else {
          // Case 
          // DELETE from cover_letter table. No cover_letter to attach.
          // console.log(`newJob has keepCoverLetter as FALSE.`)
          // console.log(`Case 3: Deleting existing cover letter.`)

          const remove = "DELETE FROM cover_letter WHERE id = $1 AND member_id = $2 RETURNING *";
          const query = {
            text: remove,
            values: [coverLetterId, memberId],
          };
          try {
            await pool.query(query);
            // coverLetter stays undefined
            coverLetterAction = 'delete';
          } catch {
            // console.log('Delete cover letter unsuccessful');
            return undefined;
          }
        }
      } else { // Just here to console log Case 1
        // console.log(`newJob has no newCoverLetter and no cover_letter_id.`)
        // console.log(`Case 1: No cover letter to edit or remove.`)
      }
    } else { // Cases 4 and 5
      // For both cases, need to attach a cover letter to the job later
      if (!coverLetterId) {
        // Case 4
        // INSERT into cover_letter table
        // console.log(`newJob has a newCoverLetter, but no cover_letter_id.`)
        // console.log(`Case 4: Adding newCoverLetter into cover_letter table. Attach this later`)

        const insert = "INSERT INTO cover_letter(member_id, file_name, mime_type) VALUES ($1, $2, $3) RETURNING *";
        const query = {
          text: insert,
          values: [memberId, newCoverLetter.file_name, newCoverLetter.mime_type],
        };
        try {
          const { rows } = await pool.query(query);
          coverLetter = rows[0];
          coverLetterAction = 'put';
        } catch {
          // console.log('Insert cover letter unsuccessful');
          return undefined;
        }
      } else {
        // Case 5
        // UPDATE cover letter table
        // console.log(`newJob has a newCoverLetter and also has a cover_letter_id.`)
        // console.log(`Case 5: Updating an existing cover letter in the cover_letter table. Attach this later`)

        // id, member_id, file_name, mime_type, bytearray_as_array   (cover_letter properties)
        const update = 'UPDATE cover_letter SET file_name = $1, mime_type = $2 WHERE id = $3 AND member_id = $4 RETURNING *'
        const query = {
          text: update,
          values: [newCoverLetter.file_name, newCoverLetter.mime_type, coverLetterId, memberId],
        };
        try {
          const { rows } = await pool.query(query);
          coverLetter = rows[0];
          coverLetterAction = 'put';
        } catch {
          // console.log('Update cover_letter unsuccessful');
          return undefined;
        }
      }
    }

    // ------------------- Update job table -------------------------
    // Update example:
    //   UPDATE resume SET file_name = $1, mime_type = $2 WHERE id = $3 AND member_id = $4 RETURNING *

    // 'title', 'company_name', 'job_description', 'notes', 'is_remote', 'country',
    // 'us_state', 'city', 'date_applied', 'date_posted', 'job_status', 'links', 'found_from'
    // NOTE: resume and cover_letter are not in keys, so they are done separately
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

    // ----- When returning the job later -----
    // For 1 (no resume), no attached resume
    // For 2 (keep existing resume), select from resume table then attach
    // For 3 (delete resume), nothing to attach
    // For 4 (add new resume) and 5 (edit resume), attach the returned resume for both

    // Update resume_id
    if (resume) {
      // Cases 2, 4, and 5 would have a resume.
      // For Cases 2 and 5, we still just update resume_id even though there's no
      //   actual change to it.
      // console.log(`resume_id set to ${resume.id}`)
      txt += `resume_id = $${count}, `;
      count++;
      vals.push(resume.id);
    } else {
      // Cases 1 and 3 won't have a resume
      // For Case 1, setting resume_id to NULL still works
      // console.log(`resume_id set to NULL.`)
      txt +=  'resume_id = NULL, ';
    }

    // Update cover_letter_id
    if (coverLetter) {
      // Cases 2, 4, and 5 would have a cover letter.
      // For Cases 2 and 5, we still just update cover_letter_id even though there's no
      //   actual change to it.
      // console.log(`cover_letter_id set to ${coverLetter.id}`)
      txt += `cover_letter_id = $${count}, `;
      count++;
      vals.push(coverLetter.id);
    } else {
      // Cases 1 and 3 won't have a cover letter
      // For Case 1, setting cover_letter_id to NULL still works
      // console.log(`cover_letter_id set to NULL.`)
      txt +=  'cover_letter_id = NULL, ';
    }

    // Remove the final comma and space then add remaining part of the query
    txt = txt.slice(0, txt.length-2) + ` WHERE id = $${count} AND member_id = $${count + 1} RETURNING *`;
    vals.push(jobId);
    vals.push(memberId);
    
    let job: Job | undefined = undefined;
    const query = {
      text: txt,
      // text: 'Bad query', // TESTING
      values: vals,
    };
    try {
      const { rows } = await pool.query(query);
      job = rows[0];
    } catch {
      // TODO: Undo the change to the resume and cover letter tables;
      // console.log('Update job unsuccessful');
      return undefined;
    }

    // -------------------- Make S3 call -------------------

    // Make the S3 call to add the resume file
    //   No s3 action to take for Cases 1 and 2 (no resume or didn't change resume)
    if (resume) {
      // console.log(`Attaching resume`)
      // There is a resume for Cases 2, 4, and 5 (no change, add new, and update)
      job!.resume = resume; // Attach the resume to the job

      // Cases 4 and 5
      if (resumeAction === 'put') { // We're either adding or replacing a file
        console.log(`S3 call attempted. In cases 4 (add) or 5 (replace)`)
        // const s3Key = s3.getResumeS3Key(resume.id!, resume.mime_type!)
        try {
          const byteArray = Uint8Array.from(newResume!.bytearray_as_array!);
          // await s3.putObject(s3Key, byteArray);
          await s3.putObject(resume.id!, byteArray);
        } catch {
          // TODO: Need to undo add resume and job to database
          console.log('Insert/replace in S3 unsucessful.');
          return undefined;
        }
      } else {
        console.log(`No S3 call. In Case 2 (no change in resume)`)
      }
    } else { // There is no resume for Cases 1 (no resume) and 3 (delete)
      if (resumeAction === 'delete') { // Case 3 (delete)
        console.log(`S3 call attempted. In cases 3, delete`)
        try {
          console.log(`Deleting file with id: ${resumeId}`);
          await s3.deleteObject(resumeId!);
        } catch (err) {
          console.error(err);
          // TODO: Need to undo add resume and job to database
          console.log('Delete from S3 unsucessful.');
          return undefined;
        }
      } else {
        console.log(`No S3 call. In Case 1 (no resume)`)
      }
    }

    // Make the S3 call to add the cover letter file
    //   No s3 action to take for Cases 1 and 2 (no cover letter or didn't change cover letter)
    if (coverLetter) {
      // console.log(`Attaching cover letter`)
      // There is a cover letter for Cases 2, 4, and 5 (no change, add new, and update)
      job!.cover_letter = coverLetter; // Attach the cover letter to the job

      // Cases 4 and 5
      if (coverLetterAction === 'put') { // We're either adding or replacing a file
        console.log(`S3 call attempted. In cases 4 (add) or 5 (replace)`)
        try {
          const byteArray = Uint8Array.from(newCoverLetter!.bytearray_as_array!);
          // await s3.putObject(s3Key, byteArray);
          await s3.putObject(coverLetter.id!, byteArray);
        } catch {
          // TODO: Need to undo add cover letter and job to database
          console.log('Insert/replace in S3 unsucessful.');
          return undefined;
        }
      } else {
        console.log(`No S3 call. In Case 2 (no change in cover letter)`)
      }
    } else { // There is no cover letter for Cases 1 (no cover letter) and 3 (delete)
      if (coverLetterAction === 'delete') { // Case 3 (delete)
        console.log(`S3 call attempted. In cases 3, delete`)
        try {
          console.log(`Deleting file with id: ${coverLetterId}`);
          await s3.deleteObject(coverLetterId!);
        } catch (err) {
          console.error(err);
          // TODO: Need to undo add cover letter and job to database
          console.log('Delete from S3 unsucessful.');
          return undefined;
        }
      } else {
        console.log(`No S3 call. In Case 1 (no cover_letter)`)
      }
    }

    // console.log('----------------------')

    return job;
  }

  public async delete(id: string, memberId: string): Promise<Job | undefined> {
    // Delete from job table
    const del = 'DELETE FROM job WHERE id = $1 AND member_id = $2 RETURNING *';
    const query = {
      text: del,
      // text: 'Bad query', // TESTING
      values: [id, memberId]
    };
    let job: Job | undefined = undefined;
    try {
      const { rows } = await pool.query(query);
      job = rows[0];
    } catch {
      // console.log('Delete job unsuccessful');
      return undefined;
    }

    // Delete from resume table if the job had a resume
    let resume: Resume | undefined = undefined;
    if (job!.resume_id) {
      const del2 = 'DELETE FROM resume WHERE id = $1 AND member_id = $2 RETURNING *';
      const query2 = {
        text: del2,
        values: [job!.resume_id, memberId]
      };
      try {
        const { rows } = await pool.query(query2);
        resume = rows[0];
      } catch {
        // TODO: Undo delete job
        // console.log('Delete resume unsuccessful');
        return undefined;
      }
    }

    // Delete from cover letter table if the job had a cover letter
    let coverLetter: CoverLetter | undefined = undefined;
    if (job!.cover_letter_id) {
      const del2 = 'DELETE FROM cover_letter WHERE id = $1 AND member_id = $2 RETURNING *';
      const query2 = {
        text: del2,
        values: [job!.cover_letter_id, memberId]
      };
      try {
        const { rows } = await pool.query(query2);
        coverLetter = rows[0];
      } catch {
        // TODO: Undo delete job and resume
        // console.log('Delete cover letter unsuccessful');
        return undefined;
      }
    }

    // Delete from S3 if job has a resume
    if (resume) {
      job!.resume = resume;

      try {
        await s3.deleteObject(resume.id!);
      } catch {
        // TODO: Need to undo delete resume and job from database
        console.log('Delete from S3 unsucessful.');
        return undefined;
      }   
    }

    // Delete from S3 if job has a cover letter
    if (coverLetter) {
      job!.cover_letter = coverLetter;

      try {
        await s3.deleteObject(coverLetter.id!);
      } catch {
        // TODO: Need to undo delete resume, cover letter, and job from database
        console.log('Delete from S3 unsucessful.');
        return undefined;
      }   
    }

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