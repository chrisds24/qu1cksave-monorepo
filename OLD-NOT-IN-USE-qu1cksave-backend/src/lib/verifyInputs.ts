import { NewJob } from "../job";
import { NewUser } from "../user";
import { states } from "./states";

export default function verifyNewJobInput(newJob: NewJob) {
  // Columns for a job in the database
  //  id, member_id, resume_id, cover_letter_id, title, company_name, job_description, notes, is_remote, salary_min, salary_max, country, us_state, city, date_saved, date_applied, date_posted, job_status, links, found_from
  // NewJob has:
    // resume_id?: string;                  EDIT
    // resume?: NewResume;
    // cover_letter_id?: string;            EDIT
    // cover_letter?: NewCoverLetter;
    // title: string;                                     max: 255          DONE
    // company_name: string;                              max: 255          DONE
    // job_description?: string;                          max: 16384
    // notes?: string;                                    max: 16384      
    // is_remote: string;                                     selected      DONE                    
    // salary_min?: number;                               max: 9999999      DONE
    // salary_max?: number;                               max: 9999999      DONE
    // country?: string;                                  max: 255          DONE
    // us_state?: string;                                     selected      DONE
    // city?: string;                                     max: 255          DONE 
    // date_applied?: YearMonthDate;                          selected      DONE
    // date_posted?: YearMonthDate;                           selected      DONE
    // job_status: string;                                    selected      DONE
    // links?: string[];                                      Also check the list length. Won't enforce limit on length for each link
    // found_from?: string;                               max: 255          DONE
    // // In job EDIT mode, used to determine if resume is to be deleted or not
    // keepResume?: boolean;                EDIT              value is automatically set
    // keepCoverLetter?: boolean;           EDIT              value is automatically set
  // No id, member_id, and date_saved
  // *** The inputs that can be manually entered (not selected) by the user in the frontend
  //      are the non-indented values saying "max: ..."
  // *** If a user decides to go on Swagger, make wrong inputs, and break the
  //     app for their account, that is on them. Also, this is the purpose of
  //     having an API key. It's so that people won't be able to do that.
  //     ********** WARNING **********
  //     https://stackoverflow.com/questions/25447188/stopping-user-to-change-values-in-html-source-before-submitting-form
  //     - They can stil edit the HTML form using Inspect in Console !!!
  //     - So its important to check everything here and not rely on frontend validation
  // *** There is no frontend validation for the resume/cover letter name
  //     since docx/pdf files aren't allowed to have a name > 255 in the first
  //     place. So I'll just add one here for backup

  try {
    // title, company_name, salary_min, salary_max, country, city, found_from, links
    if (!newJob.title || newJob.title.length > 255) { return false }
    if (!newJob.company_name || newJob.company_name.length > 255) { return false }
    if (newJob.job_description && newJob.job_description.length > 16384) { return false }
    if (newJob.notes && newJob.notes.length > 16384) { return false }
    if (newJob.salary_min !== undefined && (newJob.salary_min > 9999999 || newJob.salary_min < 0)) { return false }
    if (newJob.salary_max !== undefined && (newJob.salary_max > 9999999 || newJob.salary_max < 0)) { return false }
    if (newJob.country && newJob.country.length > 255) { return false }
    if (newJob.city && newJob.city.length > 255) { return false }
    if (newJob.found_from && newJob.found_from.length > 255) { return false }

    const remoteOptions = ['Remote', 'Hybrid', 'On-site']
    if(!newJob.is_remote || !remoteOptions.includes(newJob.is_remote)) { return false }

    if (newJob.us_state && !states.hasOwnProperty(newJob.us_state)) { return false }

    // dayjs().year()// => 2020
    // dayjs().month()// => 0-11
    // dayjs().date()// => 1-31
    const dateApplied = newJob.date_applied;
    if (dateApplied) {
      // The 1900 and 2099 comes from the calendar
      // This doesn't really correctly check number of days in a month and leap years
      if (dateApplied.year < 1900 || dateApplied.year > 2099)  { return false };
      if (dateApplied.month < 0 || dateApplied.month > 11)  { return false };
      if (dateApplied.date < 1 || dateApplied.month > 31)  { return false };
    }
    const datePosted = newJob.date_posted;
    if (datePosted) {
      // The 1900 and 2099 comes from the calendar
      // This doesn't really correctly check number of days in a month and leap years
      if (datePosted.year < 1900 || datePosted.year > 2099)  { return false };
      if (datePosted.month < 0 || datePosted.month > 11)  { return false };
      if (datePosted.date < 1 || datePosted.month > 31)  { return false };
    }

    const statusList = ['Not Applied', 'Applied', 'Assessment', 'Interview', 'Job Offered', 'Accepted Offer', 'Declined Offer', 'Rejected', 'Ghosted', 'Closed'];
    if(!newJob.job_status || !statusList.includes(newJob.job_status)) { return false }

    const links = newJob.links;
    if (links) {
      if (links.length > 10) { return false }
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.length > 1024) {
          return false;
        }
      }
    }

    // Check the newResume/newCoverLetter
    // - Both NewResume and NewCoverLetter have a file_name of max length 255
    // - No need to check the file length, since I'll just limit the maximum
    //   request size (2 mb)
    if (newJob.resume) {
      if (!newJob.resume.file_name || newJob.resume.file_name.length > 255) { return false }
      if (!newJob.resume.mime_type || newJob.resume.mime_type.length > 255) { return false }
    }
    if (newJob.cover_letter) {
      if (!newJob.cover_letter.file_name || newJob.cover_letter.file_name.length > 255) { return false }
      if (!newJob.cover_letter.mime_type || newJob.cover_letter.mime_type.length > 255) { return false }
    }

    return true
  } catch {
    return false;
  }
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
//   in a request (Ex. I had a 2 mb limit for the API), and just say
//   something about the request size being too big (or just say "Error
//   Processing Request", since most users wouldn't even reach this size
//   unless they're purposely trying to test the limits of the app)

