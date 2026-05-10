import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoginDto, UserRole } from "./dto/login.dto";

export interface LoginResponse {
  role: UserRole;
  username: string;
  displayName: string;
}

interface LoginConfig {
  displayName: string;
  usernameEnvKey: string;
  defaultUsername: string;
  passwordEnvKey: string;
  defaultPassword: string;
}

const LOGIN_CONFIG: Record<UserRole, LoginConfig> = {
  OWNER: {
    displayName: "Owner",
    usernameEnvKey: "OWNER_LOGIN_USERNAME",
    defaultUsername: "owner",
    passwordEnvKey: "OWNER_LOGIN_PASSWORD",
    defaultPassword: "owner123"
  },
  MERCHANT: {
    displayName: "Merchant",
    usernameEnvKey: "MERCHANT_LOGIN_USERNAME",
    defaultUsername: "merchant",
    passwordEnvKey: "MERCHANT_LOGIN_PASSWORD",
    defaultPassword: "merchant123"
  },
  SAMPLE_DEPARTMENT: {
    displayName: "Sample Development",
    usernameEnvKey: "SAMPLE_DEPARTMENT_LOGIN_USERNAME",
    defaultUsername: "sample",
    passwordEnvKey: "SAMPLE_DEPARTMENT_LOGIN_PASSWORD",
    defaultPassword: "sample123"
  },
  STITCHING_DEPARTMENT: {
    displayName: "Stitching Department",
    usernameEnvKey: "STITCHING_DEPARTMENT_LOGIN_USERNAME",
    defaultUsername: "stitching",
    passwordEnvKey: "STITCHING_DEPARTMENT_LOGIN_PASSWORD",
    defaultPassword: "stitching123"
  },
  CUTTING_DEPARTMENT: {
    displayName: "Cutting Department",
    usernameEnvKey: "CUTTING_DEPARTMENT_LOGIN_USERNAME",
    defaultUsername: "cutting",
    passwordEnvKey: "CUTTING_DEPARTMENT_LOGIN_PASSWORD",
    defaultPassword: "cutting123"
  }
};

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  login(loginDto: LoginDto): LoginResponse {
    const username = loginDto.username.trim();
    const expected = this.getLoginConfig(loginDto.role);

    if (username !== expected.username || loginDto.password !== expected.password) {
      throw new UnauthorizedException("Invalid username or password");
    }

    return {
      role: loginDto.role,
      username,
      displayName: expected.displayName
    };
  }

  private getLoginConfig(
    role: UserRole
  ): { username: string; password: string; displayName: string } {
    const config = LOGIN_CONFIG[role];

    return {
      displayName: config.displayName,
      username: this.configService.get<string>(config.usernameEnvKey, config.defaultUsername),
      password: this.configService.get<string>(config.passwordEnvKey, config.defaultPassword)
    };
  }
}
