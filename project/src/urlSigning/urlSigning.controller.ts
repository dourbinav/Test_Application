import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { UrlSigningService } from '../urlSigning/urlSigning.service';
import type { Request, Response } from 'express';

@Controller('url')
export class UrlSigningController {
  constructor(private readonly urlSigningService: UrlSigningService) {}

  @Post('invite-user') // e.g., an admin endpoint
  inviteUser(userId: string, testId: string) {
    // In a real app, you'd get userId and testId from the request body

    const linkExpiresInSeconds = 3600 * 1; // 24 hours

    const signedUrl = this.urlSigningService.generatingSignedUrl(
      userId,
      testId,
      linkExpiresInSeconds,
    );

    // Now you would typically email this URL to the user
    return {
      message: `Invitation link for user ${userId} has been generated.`,
      url: signedUrl,
    };
  }

  @Get('start-test/:testId')
  async startTest(
    @Param('testId') testId: string,
    @Req() request: Request,
    @Res() response: Response, // Inject the Express Response object
  ) {
    console.log('=====,.,.,.,.', testId);

    console.log('Request URL:', request.originalUrl);
    // The service will throw an exception if validation fails
    const res = await this.urlSigningService.validateTestLink(
      request.originalUrl,
      testId,
    );

    // If validation succeeds, create a test session and redirect
    // const userId = request.query.userId as string;

    // Logic to create a test session for the user...

    // Redirect the user to the front-end application
    const frontEndUrl = res
      ? `http://localhost:3000/test?testID=${testId}`
      : `http://localhost:3000/test`;
    return response.redirect(frontEndUrl);
  }
}
