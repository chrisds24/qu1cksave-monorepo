import { Controller, Get, Post, Put, Path, Query, Response, SuccessResponse, Route, Security, Body, Request, Delete} from "tsoa";
import { Job, NewJob } from ".";
import { JobService } from "./service";
import * as express from 'express';
import verifyNewJobInput from "../lib/verifyInputs";

@Route("job")
export class JobController extends Controller {
  @Get()
  @Security('jwt', ['member'])
  @Response('401', 'Unauthorized')
  public async getMultiple(
    @Request() request: express.Request,
    @Query() id?: string
  ): Promise<Job[] | undefined> {
    // NOTE: Above, I'm getting the id of the user whose jobs we want to get
    //   from the query so that I'm adhering to REST (which says that we filter
    //   a resource through parameters passed in the query). But below, I'm
    //   actually using the user id from the decoded JWT
    if (id !== request.user.id) {
      return undefined;
    }

    return new JobService()
      .getMultiple(request.user.id)
      .then(async (jobs: Job[] | undefined): Promise<Job[] | undefined> => {
        return jobs;
      });

    // If there's an error of some kind, the response won't be a 200
    // If there's no error, will return a list (could be empty).
  }

  @Post()
  @Security('jwt', ['member'])
  @Response('401', 'Unauthorized')
  @SuccessResponse("201", "Product created")
  public async create(
    @Body() newJob: NewJob,
    @Request() request: express.Request,
  ): Promise<Job | undefined> {
    if (!verifyNewJobInput(newJob)) {
      return undefined
    }
    return await new JobService().create(newJob, request.user.id);
  }

  @Put('{id}')
  @Security('jwt', ['member'])
  @Response('401', 'Unauthorized')
  @Response('404', 'Not Found')
  public async edit(
    @Path() id: string,
    @Body() newJob: NewJob,
    @Request() request: express.Request,
  ): Promise<Job | undefined> {
    if (!verifyNewJobInput(newJob)) {
      return undefined
    }
    return await new JobService().edit(newJob, request.user.id, id);
  }

  @Delete('{id}')
  @Security('jwt', ['member'])
  @Response('401', 'Unauthorized')
  @Response('404', 'Not Found')
  public async delete(
    @Path() id: string,
    @Request() request: express.Request,
  ): Promise<Job | undefined> {
    return await new JobService().delete(id, request.user.id);
  }

  // @Get('{id}')
  // @Security('jwt', ['member'])
  // @Response('401', 'Unauthorized')
  // @Response('404', 'Not Found')
  // public async getOne(
  //   @Path() id: string
  // ): Promise<Job | undefined> {
  //   return new JobService()
  //     .getOne(id)
  //     .then(async (job: Job | undefined): Promise<Job | undefined> => {
  //       return job;
  //     });
  // }
}

// ================== DELETE LATER ========================
// View processes listening to 3010:    lsof -i :3010
// Kill process 37905:                  kill -9 37905
// - Replace 37905 with whatever gets shown by the lsof command above

// The code below is to generate jobs for the database

// function getRandomInt(min: number, max: number) {
//   const minCeiled = Math.ceil(min);
//   const maxFloored = Math.floor(max);
//   return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
// }

// const statuses = {
//     0: 'Applied',
//     1: 'Not Applied',
//     2: 'Assessment',
//     3: 'Interview',
//     4: 'Job Offered',
//     5: 'Accepted Offer',
//     6: 'Declined Offer',
//     7: 'Rejected',
//     8: 'Ghosted',
//     9: 'Closed'
// }

// const remote = {
//     0: 'Remote',
//     1: 'Hybrid',
//     2: 'On-site'
// }

// const title = {
//     0: 'Software Engineer',
//     1: 'Full Stack Engineer',
//     2: 'Software Developer',
//     3: 'Full Stack Developer',
//     4: 'Frontend Engineer',
//     5: 'Frontend Developer',
//     6: 'Backend Engineer',
//     7: 'Backend Developer',
//     8: 'Web Developer',
//     9: 'Full Stack Software Engineer'
// }

// const company = {
//     0: 'Google',
//     1: 'Tesla',
//     2: 'Amazon',
//     3: 'Meta',
//     4: 'Netflix',
//     5: 'Atlassian',
//     6: 'Doordash',
//     7: 'Uber',
//     8: 'Twitter',
//     9: 'YouTube'
// }

// for (let i = 0; i < 400; i++) {
//     const titleNum = getRandomInt(0, 10);

//     const companyNum = getRandomInt(0, 10);

//     const remoteNum = getRandomInt(0, 3);

//     // Applied, Not Applied, Assessment, Interview, Job Offered, Accepted Offer, Declined Offer, Rejected, Ghosted, Closed
//     const statusNum = getRandomInt(0, 10);

//     let uuidPortion = '0000';
//     if (i < 10) { // 0 to 9
//         uuidPortion = `000${i}`;
//     } else if (i < 100) { // 10 to 99
//         uuidPortion = `00${i}`;
//     } else if (i < 1000) { // 100 to 999
//         uuidPortion = `0${i}`
//     } else if (i < 10000) { // 1000 to 9999
//         uuidPortion = `${i}`
//     }

//     console.log(`INSERT INTO job(id, member_id, title, company_name, is_remote, job_status) VALUES ('018eae28-8323-7918-${uuidPortion}-6cdb9d189781', '269a3d55-4eee-4a2e-8c64-e1fe386b76f8', '${(title as any)[titleNum]}', '${(company as any)[companyNum]}', '${(remote as any)[remoteNum]}', '${(statuses as any)[statusNum]}');`)
// }