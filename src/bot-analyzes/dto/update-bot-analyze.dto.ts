import { PartialType } from '@nestjs/mapped-types';
import { CreateBotAnalyzeDto } from './create-bot-analyze.dto';

export class UpdateBotAnalyzeDto extends PartialType(CreateBotAnalyzeDto) {}
