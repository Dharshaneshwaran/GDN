import { Type } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateInwardDto {
  @IsUUID()
  outwardEntryId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  receivedWeight: number;

  @IsDateString()
  receivedDate: string;

  @IsOptional()
  @IsString()
  receivedBy?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
