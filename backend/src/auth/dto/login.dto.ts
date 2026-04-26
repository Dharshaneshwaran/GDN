import { IsIn, IsNotEmpty, IsString } from "class-validator";

export type UserRole = "OWNER" | "MERCHANT";

export class LoginDto {
  @IsIn(["OWNER", "MERCHANT"])
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
