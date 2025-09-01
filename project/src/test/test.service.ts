import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './test.entity';
import { User } from '../user/user.entity';
import { Question } from './question.entity';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test) private testRepo: Repository<Test>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
  ) {}

  async getTests() {
    const test = await this.testRepo.find();
    return test;
  }

  async getTestById(testId: number) {
    console.log('testIdddd', testId);
    const test = await this.questionRepo.find({
      where: {
        test: { id: testId }, // if "test" is a relation
      },
    });
    console.log('returninggg', test);
    return test;
  }

  async createTest(dto: CreateTestDto) {
    // 1. Save the test
    const test = await this.testRepo.save({
      testName: dto.name,
      expiresAt: dto.expiresAt,
    });

    // 2. Create questions with relation to test
    const questions = dto.questions.map((q) => {
      const correctChoice = q.choices.find((c) => c.isCorrect);

      return {
        text: q.text,
        options: q.choices.map((c) => c.text), // store as string[]
        correctAnswer: correctChoice ? correctChoice.text : null,
        test: test, // pass relation, not just ID
      };
    });
    // 3. Save questions
    const savedQuestions = await this.questionRepo.save(questions);

    return {
      ...test,
      questions: savedQuestions, // ✅ return actual saved questions
    };
  }

  async addQuestion(testId: number, questionData: Partial<Question>) {
    const test = await this.testRepo.findOne({
      where: { id: testId },
      relations: ['questions'],
    });
    if (!test) throw new NotFoundException('Test not found');

    const question = this.questionRepo.create({ ...questionData, test });
    test.questions.push(question);

    return await this.testRepo.save(test);
  }

  async updateQuestion(questionId: number, dto: UpdateQuestionDto) {
    const question = await this.questionRepo.findOne({
      where: { id: questionId },
    });
    if (!question) throw new NotFoundException('Question not found');

    Object.assign(question, dto);
    return await this.questionRepo.save(question);
  }

  async deleteQuestion(questionId: number) {
    const res = await this.questionRepo.delete(questionId);
    if (res.affected === 0) throw new NotFoundException('Question not found');
    return { message: 'Deleted successfully' };
  }

  async getUserTest(testId: number) {
    // return await this.testRepo.find({
    //   where: { user: { id: userId } },
    //   relations: ['questions'],
    // });

    //get all question related to this test id
    return await this.questionRepo.find({
      where: { test: { id: testId } },
    });
  }
}
