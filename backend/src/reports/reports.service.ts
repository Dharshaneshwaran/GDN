import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InwardEntry } from "../inward/inward-entry.entity";
import { OutwardEntry } from "../outward/outward-entry.entity";

type ReportStatus = "PENDING_RETURN" | "NORMAL" | "SHORTAGE_ALERT";

export interface FabricReport {
  outwardEntry: Omit<OutwardEntry, "inwardEntries">;
  inwardEntry: InwardEntry | null;
  expectedReceivedWeight: number | null;
  receivedWeight: number | null;
  shortage: number | null;
  status: ReportStatus;
  whatsappAlertUrl: string | null;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(OutwardEntry)
    private readonly outwardRepository: Repository<OutwardEntry>
  ) {}

  async findAll(): Promise<FabricReport[]> {
    const outwardEntries = await this.outwardRepository.find({
      relations: { inwardEntries: true },
      order: { createdAt: "DESC" }
    });

    return outwardEntries.map(({ inwardEntries, ...outwardReportEntry }) => {
      const inwardEntry = this.getLatestInwardEntry(inwardEntries);

      if (!inwardEntry) {
        return {
          outwardEntry: outwardReportEntry,
          inwardEntry: null,
          expectedReceivedWeight: null,
          receivedWeight: null,
          shortage: null,
          status: "PENDING_RETURN",
          whatsappAlertUrl: null
        };
      }

      const shortage = inwardEntry.shortage ?? 0;

      return {
        outwardEntry: outwardReportEntry,
        inwardEntry,
        expectedReceivedWeight: inwardEntry.expectedReceivedWeight,
        receivedWeight: inwardEntry.receivedWeight,
        shortage,
        status: shortage > 0 ? "SHORTAGE_ALERT" : "NORMAL",
        whatsappAlertUrl: inwardEntry.whatsappAlertUrl
      };
    });
  }

  private getLatestInwardEntry(inwardEntries: InwardEntry[] | undefined): InwardEntry | null {
    if (!inwardEntries || inwardEntries.length === 0) {
      return null;
    }

    return [...inwardEntries].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )[0];
  }
}
