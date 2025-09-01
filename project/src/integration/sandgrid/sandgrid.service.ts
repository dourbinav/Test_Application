import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  constructor() {
    sgMail.setApiKey(process.env.SANDGRID_KEY || ''); // must not be undefined
  }

  async sendEmail(to: string, subject: string, text: string) {
    const msg = {
      to,
      from: 'navaldourbi2709@gmail.com', // must be verified in SendGrid
      subject,
      text,
    };

    try {
      await sgMail.send(msg);
      return 'Email sent successfully';
    } catch (error: any) {
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Failed to send email: ${error} - ${JSON.stringify(error.response)}`,
      );
    }
  }
}
