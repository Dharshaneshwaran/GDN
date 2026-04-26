import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OutwardEntry } from "./outward-entry.entity";
import { OutwardController } from "./outward.controller";
import { OutwardService } from "./outward.service";

@Module({
  imports: [TypeOrmModule.forFeature([OutwardEntry])],
  controllers: [OutwardController],
  providers: [OutwardService],
  exports: [OutwardService, TypeOrmModule]
})
export class OutwardModule {}
