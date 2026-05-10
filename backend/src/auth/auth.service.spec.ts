import "reflect-metadata";
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { AuthService } from "./auth.service";
import type { LoginDto, UserRole } from "./dto/login.dto";

const configService = {
  get<T>(_key: string, defaultValue: T): T {
    return defaultValue;
  }
} as ConfigService;

function loginPayload(role: UserRole, username: string, password: string): LoginDto {
  return { role, username, password };
}

describe("AuthService", () => {
  it("authenticates department demo logins", () => {
    const authService = new AuthService(configService);

    assert.deepEqual(
      authService.login(loginPayload("SAMPLE_DEPARTMENT" as UserRole, "sample", "sample123")),
      {
        role: "SAMPLE_DEPARTMENT",
        username: "sample",
        displayName: "Sample Development"
      }
    );
    assert.deepEqual(
      authService.login(
        loginPayload("STITCHING_DEPARTMENT" as UserRole, "stitching", "stitching123")
      ),
      {
        role: "STITCHING_DEPARTMENT",
        username: "stitching",
        displayName: "Stitching Department"
      }
    );
    assert.deepEqual(
      authService.login(loginPayload("CUTTING_DEPARTMENT" as UserRole, "cutting", "cutting123")),
      {
        role: "CUTTING_DEPARTMENT",
        username: "cutting",
        displayName: "Cutting Department"
      }
    );
  });

  it("rejects incorrect department credentials", () => {
    const authService = new AuthService(configService);

    assert.throws(
      () =>
        authService.login(loginPayload("CUTTING_DEPARTMENT" as UserRole, "cutting", "wrong")),
      UnauthorizedException
    );
  });
});
