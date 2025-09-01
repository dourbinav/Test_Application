import { IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChoiceDto {
  text: string;
  isCorrect: boolean;
}

export class CreateQuestionDto {
  text: string;
  choices: CreateChoiceDto[];
}

export class CreateTestDto {
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsDateString()
  expiresAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsArray()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @ValidateNested({ each: true })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
