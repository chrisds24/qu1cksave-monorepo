import { NewJob } from "src/job";
import { NewUser } from "src/user";

export default function verifyNewJobInput(newJob: NewJob) {
  // Columns for a job in the database
  //  id, member_id, resume_id, cover_letter_id, title, company_name, job_description, notes, is_remote, salary_type, salary_min, salary_max, country, us_state, city, date_saved, date_applied, date_posted, job_status, links, found_from
  // NewJob has:
    // resume_id?: string;                  EDIT
    // resume?: NewResume;
    // cover_letter_id?: string;            EDIT
    // cover_letter?: NewCoverLetter;
    // title: string;                                     max: 255
    // company_name: string;                              max: 255
    // job_description?: string;                              Won't enforce limit on length  
    // notes?: string;                                        Won't enforce limit on length       
    // is_remote: string;                                     selected                         
    // salary_type?: string;                                  selected
    // salary_min?: number;                               max: 9999999
    // salary_max?: number;                               max: 9999999
    // country?: string;                                  max: 255
    // us_state?: string;                                     selected
    // city?: string;                                     max: 255
    // date_applied?: YearMonthDate;                          selected
    // date_posted?: YearMonthDate;                           selected
    // job_status: string;                                    selected
    // links?: string[];                                      Also check the list length. Won't enforce limit on length for each link
    // found_from?: string;                               max: 255
    // // In job EDIT mode, used to determine if resume is to be deleted or not
    // keepResume?: boolean;                EDIT              value is automatically set
    // keepCoverLetter?: boolean;           EDIT              value is automatically set
  // No id, member_id, and date_saved
  // *** I'll only check inputs that can be manually entered (not selected) by the user in the frontend.
  //     Above, those are the non-indented values saying "max: ..."
  // *** If a user decides to go on Swagger, make wrong inputs, and break the
  //     app for their account, that is on them. Also, this is the purpose of
  //     having an API key. It's so that people won't be able to do that.
  //     ********** WARNING **********
  //     https://stackoverflow.com/questions/25447188/stopping-user-to-change-values-in-html-source-before-submitting-form
  //     - They can stil edit the HTML form using Inspect in Console !!!
  // *** The only main concerns here are title, company_name, salary_min/max,
  //     country, city, and found from (in the case that the frontend input
  //     validation for those fail).
  //     They won't really be able to have links > 10.
  //     There is no frontend validation for the resume/cover letter name
  //     since docx/pdf files aren't allowed to have a name > 255 in the first
  //     place. But I'll just add one here for backup

  // title, company_name, salary_min, salary_max, country, city, found_from, links
  if (!newJob.title || newJob.title.length > 255) return false
  if (!newJob.company_name || newJob.company_name.length > 255) return false
  if (newJob.salary_min !== undefined && (newJob.salary_min > 9999999 || newJob.salary_min < 0)) return false
  if (newJob.salary_max !== undefined && (newJob.salary_max > 9999999 || newJob.salary_max < 0)) return false
  if (newJob.country && newJob.country.length > 255) return false
  if (newJob.city && newJob.city.length > 255) return false
  if (newJob.found_from && newJob.found_from.length > 255) return false

  // Check the newResume/newCoverLetter file name
  // - Both NewResume and NewCoverLetter have a file_name of max length 255
  if (newJob.resume && newJob.resume.file_name.length > 255) return false
  if (newJob.cover_letter && newJob.cover_letter.file_name.length > 255) return false

  return true
}

export function verifyNewUserInput(newUser: NewUser) {
  // ---------- NewUser ----------
  // email, password, name
  // 
  // email      string      max: 254
  // password   string      min: 8, max: unlimited
  // - In database, type is text (unlimited length). Hashed password is stored
  // name       string      max: 255
  if(!newUser.email || newUser.email.length > 254) return false
  if(!newUser.password || newUser.password.length < 8) return false
  if(!newUser.name || newUser.name.length > 255) return false

  return true
}

// Some useful info:
// ---------- Emails -------------
// https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
// - Some say 320. Some say 254. I'll just use 254
// https://www.directedignorance.com/blog/maximum-length-of-email-address
// - Also talks about the maximum of 254
//
// ---------- Passwords ----------
// https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
// - Minimum 8 chars, maximum of at least 64 chars
// https://stackoverflow.com/questions/98768/should-i-impose-a-maximum-length-on-passwords
// - Don't impose a limit. It's less secure
// - ME: I could probably just limit the amount of memory that can be used
//   in a request (Ex. I had a 2000 mb limit for the API), and just say
//   something about the request size being too big (or just say "Error
//   Processing Request", since most users wouldn't even reach this size
//   unless they're purposely trying to test the limits of the app)

