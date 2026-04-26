import { Module } from "@nestjs/common";
import { BrevoEmailService } from "./email.service";

@Module({
  providers: [BrevoEmailService],
  exports: [BrevoEmailService]
})
export class EmailModule {}
