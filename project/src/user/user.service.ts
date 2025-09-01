import { Injectable } from '@nestjs/common';
import { SendgridService } from 'src/integration/sandgrid/sandgrid.service';
import { UrlSigningService } from 'src/urlSigning/urlSigning.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Test } from 'src/test/test.entity';

@Injectable()
export class UserService {
  private readonly serviceName = 'UserService';

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Test) private testRepository: Repository<Test>,

    private readonly mailService: SendgridService,
    private readonly urlSigningService: UrlSigningService,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email: username } });
  }

  async createUser(data: {
    name: string;
    email: string;
    joinDate: string;
    techStack: string;
    testId: string;
  }) {
    console.log(`${this.serviceName} - Creating user with data:`, data);

    // Convert joinDate string to valid Date object
    const joinDate = new Date(data.joinDate);
    if (isNaN(joinDate.getTime())) {
      throw new Error(`Invalid date format: ${data.joinDate}`);
    }

    // Send email to admin
    await this.mailService.sendEmail(
      'hellodourbi@gmail.com',
      'New User Signup',
      `A new user has signed up with email: ${data.email}`,
    );

    // Fetch the Test entity
    const testEntity = await this.testRepository.findOne({
      where: { id: Number(data.testId) },
    });
    if (!testEntity) throw new Error('Test not found');

    // Create user entity
    const user = this.usersRepository.create({
      email: data.email,
      dateofJoining: joinDate, // match entity
      TechStack: data.techStack, // match entity
      iscertified: false, // match entity
      test: testEntity,
    });

    // Save user
    const savedUser = await this.usersRepository.save(user);
    console.log('=====>saveddd', savedUser);

    // Generate signed URL
    const linkExpiresInSeconds = 3600; // 1 hour
    const testUrl = await this.urlSigningService.generatingSignedUrl(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      String(savedUser.id),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      data.testId,
      linkExpiresInSeconds,
    );

    // Send email to user
    await this.mailService.sendEmail(
      data.email,
      'Your Test Link',
      `Hello, your test link has been created successfully! ${testUrl}`,
    );

    return savedUser;
  }
}
