import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoginDto, UserRole } from "./dto/login.dto";

export interface LoginResponse {
  role: UserRole;
  username: string;
  displayName: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  login(loginDto: LoginDto): LoginResponse {
    const username = loginDto.username.trim();
    const expected = this.getCredentials(loginDto.role);

    if (username !== expected.username || loginDto.password !== expected.password) {
      throw new UnauthorizedException("Invalid username or password");
    }

    return {
      role: loginDto.role,
      username,
      displayName: loginDto.role === "OWNER" ? "Owner" : "Merchant"
    };
  }

  private getCredentials(role: UserRole): { username: string; password: string } {
    if (role === "OWNER") {
      return {
        username: this.configService.get<string>("OWNER_LOGIN_USERNAME", "owner"),
        password: this.configService.get<string>("OWNER_LOGIN_PASSWORD", "owner123")
      };
    }

    return {
      username: this.configService.get<string>("MERCHANT_LOGIN_USERNAME", "merchant"),
      password: this.configService.get<string>("MERCHANT_LOGIN_PASSWORD", "merchant123")
    };
  }
}
