import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CalculationModule } from "../common/calculation.module";
import { EmailModule } from "../email/email.module";
import { OutwardModule } from "../outward/outward.module";
import { WhatsappModule } from "../whatsapp/whatsapp.module";
import { InwardEntry } from "./inward-entry.entity";
import { InwardController } from "./inward.controller";
import { InwardService } from "./inward.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([InwardEntry]),
    OutwardModule,
    CalculationModule,
    WhatsappModule,
    EmailModule
  ],
  controllers: [InwardController],
  providers: [InwardService],
  exports: [InwardService, TypeOrmModule]
})
export class InwardModule {}
