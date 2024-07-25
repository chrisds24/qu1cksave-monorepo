import { NewJob } from "src/job";
import { Credentials, NewUser } from "src/user";

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
    // job_description?: string;                            Won't enforce limit on length  
    // notes?: string;                                      Won't enforce limit on length       
    // is_remote: string;                                   selected                         
    // salary_type?: string;                                selected
    // salary_min?: number;                               max: 9999999
    // salary_max?: number;                               max: 9999999
    // country?: string;                                  max: 255
    // us_state?: string;                                   selected
    // city?: string;                                     max: 255
    // date_applied?: YearMonthDate;                        selected
    // date_posted?: YearMonthDate;                         selected
    // job_status: string;                                  selected
    // links?: string[];                                   Just check list length (Won't enforce limit on length for each link)
    // found_from?: string;                               max: 255
    // // In job EDIT mode, used to determine if resume is to be deleted or not
    // keepResume?: boolean;                EDIT            value is automatically set
    // keepCoverLetter?: boolean;           EDIT            value is automatically set
  // No id, member_id, and date_saved
  // *** I'll only check inputs that can be entered by the user in the frontend.
  // *** If a user decides to go on Swagger, make wrong inputs, and break the
  //     app for their account, that is on them. Also, this is the purpose of
  //     having an API key. It's so that people won't be able to do that.

  // title, company_name, salary_min, salary_max, country, city, found_from, links
  if (newJob.title.length > 255) return false
  if (newJob.company_name.length > 255) return false
  if (newJob.salary_min && newJob.salary_min > 9999999) return false
  if (newJob.salary_max && newJob.salary_max > 9999999) return false
  if (newJob.country && newJob.country.length > 255) return false
  if (newJob.city && newJob.city.length > 255) return false
  if (newJob.found_from && newJob.found_from.length > 255) return false
  if (newJob.links && newJob.links.length > 10) return false

  // TODO: Also check the resume file name

  return true
}

export function verifyCredentialsInput(credentials: Credentials | NewUser, isNewUser: boolean) {
  // ---------- Credentials / NewUser ----------
  // email, password, name (for NewUser)
  // 
  // email      string      max: 320
  // password   string      min: 8, max: unlimited
  // - In database, type is text (unlimited length). Hashed password is stored
  // name       string      max: 255

  // TODO
  // ...

  // Just check type to know if it's a NewUser and we need to check name

}

