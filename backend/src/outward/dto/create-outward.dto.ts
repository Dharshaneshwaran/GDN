import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateOutwardDto {
  @IsString()
  @IsNotEmpty()
  partyName: string;

  @IsString()
  @IsNotEmpty()
  processType: string;

  @IsString()
  @IsNotEmpty()
  fabricType: string;

  @IsString()
  @IsNotEmpty()
  lotNumber: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  sentWeight: number;

  @IsDateString()
  sentDate: string;

  @IsOptional()
  @IsString()
  vehicleNumber?: string;

  @IsOptional()
  @IsString()
  driverName?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  allowedLossPercent: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
