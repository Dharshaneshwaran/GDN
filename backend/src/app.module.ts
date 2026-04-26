import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { CalculationModule } from "./common/calculation.module";
import { InwardEntry } from "./inward/inward-entry.entity";
import { InwardModule } from "./inward/inward.module";
import { OutwardEntry } from "./outward/outward-entry.entity";
import { OutwardModule } from "./outward/outward.module";
import { ReportsModule } from "./reports/reports.module";
import { EmailModule } from "./email/email.module";
import { WhatsappModule } from "./whatsapp/whatsapp.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        url: configService.getOrThrow<string>("DATABASE_URL"),
        entities: [OutwardEntry, InwardEntry],
        synchronize: false,
        ssl: {
          rejectUnauthorized: false
        }
      })
    }),
    CalculationModule,
    AuthModule,
    WhatsappModule,
    EmailModule,
    OutwardModule,
    InwardModule,
    ReportsModule
  ],
  controllers: [AppController]
})
export class AppModule {}
