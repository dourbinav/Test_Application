import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  test() {
    return this.testService.getTests();
  }
  @Get(':testId')
  async getTestById(@Param('testId', ParseIntPipe) testId: number) {
    return this.testService.getTestById(testId);
  }

  @Post()
  createTest(@Body() dto: CreateTestDto) {
    return this.testService.createTest(dto);
  }

  @Post(':testId/questions')
  addQuestion(@Param('testId') testId: number, @Body() body: any) {
    return this.testService.addQuestion(testId, body);
  }

  @Patch('questions/:id')
  updateQuestion(@Param('id') id: number, @Body() dto: UpdateQuestionDto) {
    return this.testService.updateQuestion(id, dto);
  }

  @Delete('questions/:id')
  deleteQuestion(@Param('id') id: number) {
    return this.testService.deleteQuestion(id);
  }

  @Get('/user/:testId')
  getUserTest(@Param('testId') userId: number) {
    return this.testService.getUserTest(userId);
  }
}
