import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { CreateOutwardDto } from "./dto/create-outward.dto";
import { OutwardEntry } from "./outward-entry.entity";

interface PostgresDriverError {
  code?: string;
}

@Injectable()
export class OutwardService {
  constructor(
    @InjectRepository(OutwardEntry)
    private readonly outwardRepository: Repository<OutwardEntry>
  ) {}

  async create(createOutwardDto: CreateOutwardDto): Promise<OutwardEntry> {
    const entry = this.outwardRepository.create({
      partyName: createOutwardDto.partyName.trim(),
      processType: createOutwardDto.processType.trim(),
      fabricType: createOutwardDto.fabricType.trim(),
      lotNumber: createOutwardDto.lotNumber.trim(),
      sentWeight: createOutwardDto.sentWeight,
      sentDate: createOutwardDto.sentDate,
      allowedLossPercent: createOutwardDto.allowedLossPercent,
      vehicleNumber: createOutwardDto.vehicleNumber?.trim() || null,
      driverName: createOutwardDto.driverName?.trim() || null,
      remarks: createOutwardDto.remarks?.trim() || null
    });

    try {
      return await this.outwardRepository.save(entry);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as PostgresDriverError;

        if (driverError.code === "23505") {
          throw new ConflictException("Lot number already exists. Please use a new lot number.");
        }
      }

      throw new InternalServerErrorException("Unable to save outward entry. Please try again.");
    }
  }

  findAll(): Promise<OutwardEntry[]> {
    return this.outwardRepository.find({
      order: { createdAt: "DESC" }
    });
  }

  async findOne(id: string): Promise<OutwardEntry> {
    const entry = await this.outwardRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException("Outward entry not found");
    }

    return entry;
  }
}
