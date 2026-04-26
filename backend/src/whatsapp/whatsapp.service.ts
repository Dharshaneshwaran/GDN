import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OutwardEntry } from "../outward/outward-entry.entity";

interface AlertInput {
  outwardEntry: OutwardEntry;
  expectedReceivedWeight: number;
  receivedWeight: number;
  shortage: number;
}

@Injectable()
export class WhatsappService {
  constructor(private readonly configService: ConfigService) {}

  buildShortageAlert(input: AlertInput): { message: string; url: string } {
    const { outwardEntry, expectedReceivedWeight, receivedWeight, shortage } = input;
    const ownerPhone = this.configService.get<string>("OWNER_PHONE", "91XXXXXXXXXX");
    const message = [
      "⚠️ Fabric Shortage Alert",
      "",
      `Party: ${outwardEntry.partyName}`,
      `Process: ${outwardEntry.processType}`,
      `Lot No: ${outwardEntry.lotNumber}`,
      `Fabric: ${outwardEntry.fabricType}`,
      "",
      `Sent Weight: ${outwardEntry.sentWeight} kg`,
      `Allowed Loss: ${outwardEntry.allowedLossPercent}%`,
      `Expected Return: ${expectedReceivedWeight} kg`,
      `Received Weight: ${receivedWeight} kg`,
      "",
      `Shortage: ${shortage} kg`,
      "",
      "Please check immediately."
    ].join("\n");

    return {
      message,
      url: `https://wa.me/${ownerPhone}?text=${encodeURIComponent(message)}`
    };
  }
}
