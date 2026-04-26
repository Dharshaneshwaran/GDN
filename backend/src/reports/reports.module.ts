import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InwardEntry } from "../inward/inward-entry.entity";
import { OutwardEntry } from "../outward/outward-entry.entity";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";

@Module({
  imports: [TypeOrmModule.forFeature([OutwardEntry, InwardEntry])],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
