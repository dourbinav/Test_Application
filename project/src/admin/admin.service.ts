import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class AdminService {
  constructor(
    @InjectRepository(Admin) private readonly adminService: Repository<Admin>,
  ) {}

  createAdmin(data: any): Promise<Admin[]> {
    const admin = this.adminService.create(data);
    return this.adminService.save(admin);
  }

  async login(data: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { email, password } = data;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const admin = await this.adminService.findOne({ where: { email } });
    if (admin && admin.password === password) {
      return 'Login successful';
    }
    return 'Invalid credentials';
  }

  async findById(userId: string): Promise<Admin | undefined> {
    return this.adminService.findOne({ where: { email: userId } });
  }

  async findByEmail(email: string): Promise<Admin | undefined> {
    return this.adminService.findOne({ where: { email } });
  }

  async updateUserRefreshToken(userId: string, refreshToken: string | null) {
    console.log(
      `Updating refresh token for user ${userId},refreshToken:${refreshToken}`,
    );

    const user = await this.adminService.findOne({
      where: { email: userId },
    });
    if (user) {
      user.refreshToken = refreshToken;
    }
    return user;
  }
}
