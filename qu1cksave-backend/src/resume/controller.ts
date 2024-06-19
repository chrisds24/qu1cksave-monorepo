import { Controller, Path, Route, Get, Security, Response, Query } from 'tsoa';
import { Resume } from '.';
import { ResumeService } from './service';

@Route("resume")
export class ResumeController extends Controller {
  @Get('{id}')
  @Security('jwt', ['member'])
  @Response('401', 'Unauthorized')
  @Response('404', 'Not Found')
  public async getOne(
    @Path() id: string
  ): Promise<Resume | undefined> {
    return new ResumeService()
      .getOne(id)
      .then(async (resume: Resume | undefined): Promise<Resume | undefined> => {
        return resume;
      });
  }
}