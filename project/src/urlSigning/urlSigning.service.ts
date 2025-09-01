import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { timingSafeEqual, createHmac } from 'crypto';
import { Test, TestStatus } from 'src/test/test.entity';
import { TestAttempt } from 'src/test/testAttempt.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UrlSigningService {
  private readonly secretKey: string;
  private readonly baseUrl: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(TestAttempt)
    private readonly testAttempt: Repository<TestAttempt>,
    @InjectRepository(Test)
    private readonly testInvitation: Repository<Test>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.secretKey = process.env.SECRET_KEY;
    this.baseUrl = 'http://localhost:3001'; // Change to your actual base URL
  }

  public async generatingSignedUrl(
    userID: string,
    testID: string,
    expiresIn: number,
  ) {
    const expires = Date.now() + expiresIn * 1000;
    const resourcePath = `/api/url/start-test/${testID}`;

    const dataToSign = resourcePath + userID + expires;

    const signature = createHmac('sha256', this.secretKey)
      .update(dataToSign)
      .digest('hex');

    // **DATABASE STEP**: Store the invitation
    const test = this.testAttempt.create({
      user: { id: Number(userID) },
      test: { id: Number(testID) },
      status: TestStatus.PENDING,
    });

    await this.testAttempt.save(test);

    return `${this.baseUrl}${resourcePath}?userId=${userID}&expires=${expires}&signature=${signature}`;
  }

  /**
   * Validates the test link, checks the database, and marks it as used.
   */
  public async validateTestLink(
    fullUrl: string,
    testId: string,
  ): Promise<boolean> {
    const url = new URL(`${this.baseUrl}${fullUrl}`);
    const expires = url.searchParams.get('expires');
    const providedSignature = url.searchParams.get('signature');
    const userId = url.searchParams.get('userId');

    if (!expires || !providedSignature || !userId) {
      throw new ForbiddenException('Missing required parameters.');
    }

    // 1. Check expiration
    if (Date.now() > parseInt(expires, 10)) {
      throw new ForbiddenException('This link has expired.');
    }

    // 2. Validate the signature
    const resourcePath = `/api/url/start-test/${testId}`;
    const dataToSign = resourcePath + userId + expires;

    const expectedSignature = createHmac('sha256', this.secretKey)
      .update(dataToSign)
      .digest('hex');
    if (
      !timingSafeEqual(
        Buffer.from(providedSignature),
        Buffer.from(expectedSignature),
      )
    ) {
      throw new ForbiddenException('Invalid signature.');
    }

    // 3. **DATABASE CHECK**: Ensure the link is one-time use
    const invitation = await this.testAttempt.findOne({
      where: {
        user: { id: Number(userId) },
        test: { id: Number(testId) }, // use test.id
        status: TestStatus.PENDING,
      },
    });

    if (!invitation) {
      throw new BadRequestException(
        'Link has already been used or is invalid.',
      );
    }

    // // Mark as used to prevent reuse
    await this.testAttempt.update(
      { id: invitation.id },
      { status: TestStatus.COMPLETED },
    );

    return true; // The URL is valid and was successfully redeemed
  }
}
