import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CalculationService } from "../common/calculation.service";
import { BrevoEmailService } from "../email/email.service";
import { OutwardService } from "../outward/outward.service";
import { WhatsappService } from "../whatsapp/whatsapp.service";
import { CreateInwardDto } from "./dto/create-inward.dto";
import { InwardEntry } from "./inward-entry.entity";

@Injectable()
export class InwardService {
  constructor(
    @InjectRepository(InwardEntry)
    private readonly inwardRepository: Repository<InwardEntry>,
    private readonly outwardService: OutwardService,
    private readonly calculationService: CalculationService,
    private readonly whatsappService: WhatsappService,
    private readonly brevoEmailService: BrevoEmailService
  ) {}

  async create(createInwardDto: CreateInwardDto): Promise<InwardEntry> {
    const outwardEntry = await this.outwardService.findOne(createInwardDto.outwardEntryId);
    const expectedReceivedWeight = this.calculationService.calculateExpectedReceivedWeight(
      outwardEntry.sentWeight,
      outwardEntry.allowedLossPercent
    );
    const shortage = this.calculationService.calculateShortage(
      expectedReceivedWeight,
      createInwardDto.receivedWeight
    );
    const status = this.calculationService.getStatus(shortage);
    const alert =
      status === "SHORTAGE_ALERT"
        ? this.whatsappService.buildShortageAlert({
            outwardEntry,
            expectedReceivedWeight,
            receivedWeight: createInwardDto.receivedWeight,
            shortage
          })
        : null;

    const entry = this.inwardRepository.create({
      outwardEntry,
      receivedWeight: createInwardDto.receivedWeight,
      receivedDate: createInwardDto.receivedDate,
      receivedBy: createInwardDto.receivedBy || null,
      remarks: createInwardDto.remarks || null,
      expectedReceivedWeight,
      shortage,
      status,
      whatsappAlertMessage: alert?.message ?? null,
      whatsappAlertUrl: alert?.url ?? null
    });

    return this.inwardRepository.save(entry);
  }

  findAll(): Promise<InwardEntry[]> {
    return this.inwardRepository.find({
      order: { createdAt: "DESC" }
    });
  }

  async sendEmailAlert(id: string): Promise<{ messageId: string; status: string }> {
    const inwardEntry = await this.inwardRepository.findOne({ where: { id } });

    if (!inwardEntry) {
      throw new NotFoundException("Inward entry not found");
    }

    if (inwardEntry.status !== "SHORTAGE_ALERT" || !inwardEntry.whatsappAlertMessage) {
      throw new BadRequestException("Email alert is available only for shortage entries");
    }

    const result = await this.brevoEmailService.sendShortageAlert(inwardEntry.whatsappAlertMessage);

    return {
      messageId: result.messageId,
      status: "EMAIL_SENT"
    };
  }
}
