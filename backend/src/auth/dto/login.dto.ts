import { IsIn, IsNotEmpty, IsString } from "class-validator";

export const USER_ROLES = [
  "OWNER",
  "MERCHANT",
  "SAMPLE_DEPARTMENT",
  "STITCHING_DEPARTMENT",
  "CUTTING_DEPARTMENT"
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export class LoginDto {
  @IsIn(USER_ROLES)
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
