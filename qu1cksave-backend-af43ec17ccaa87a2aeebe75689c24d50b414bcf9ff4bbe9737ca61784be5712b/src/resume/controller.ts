import { Controller, Path, Route, Get, Security, Response, Request } from 'tsoa';
import { Resume } from '.';
import { ResumeService } from './service';
import * as express from 'express';

@Route("resume")
export class ResumeController extends Controller {
  @Get('{id}')
  @Security('jwt', ['member'])
  @Response('401', 'Unauthorized')
  @Response('404', 'Not Found')
  public async getOne(
    @Path() id: string,
    @Request() request: express.Request
  ): Promise<Resume | undefined> {
    return new ResumeService()
      .getOne(id, request.user.id)
      .then(async (resume: Resume | undefined): Promise<Resume | undefined> => {
        return resume;
      });
  }
}