import { Controller, Get, Query, Response, Route, Security} from "tsoa";
import { Job } from ".";
import { JobService } from "./service";

@Route("job")
export class JobController extends Controller {
  // TODO: I need to add a check here so that people who know someone's id
  //   can't just view other people's saved jobs.
  @Get()
  @Security("jwt", ["member"])
  @Response('401', 'Unauthorized')
  public async getMultiple(
    @Query() id: string
  ): Promise<Job[]> {
    return new JobService()
      .getMultiple(id)
      .then(async (jobs: Job[]): Promise<Job[]> => {
        return jobs;
      });
  }
}