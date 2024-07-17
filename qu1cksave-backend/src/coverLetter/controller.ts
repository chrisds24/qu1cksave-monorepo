import { Controller, Path, Route, Get, Security, Response, Request } from 'tsoa';
import { CoverLetter } from '.';
import { CoverLetterService } from './service';
import * as express from 'express';

@Route("coverLetter")
export class CoverLetterController extends Controller {
  @Get('{id}')
  @Security('jwt', ['member'])
  @Response('401', 'Unauthorized')
  @Response('404', 'Not Found')
  public async getOne(
    @Path() id: string,
    @Request() request: express.Request
  ): Promise<CoverLetter | undefined> {
    return new CoverLetterService()
      .getOne(id, request.user.id)
      .then(async (coverLetter: CoverLetter | undefined): Promise<CoverLetter | undefined> => {
        return coverLetter;
      });
  }
}