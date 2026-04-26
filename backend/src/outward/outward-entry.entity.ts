import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { numericTransformer } from "../common/numeric.transformer";
import { InwardEntry } from "../inward/inward-entry.entity";

@Entity({ name: "outward_entries" })
export class OutwardEntry {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "party_name", type: "text" })
  partyName: string;

  @Column({ name: "process_type", type: "text" })
  processType: string;

  @Column({ name: "fabric_type", type: "text" })
  fabricType: string;

  @Column({ name: "lot_number", type: "text", unique: true })
  lotNumber: string;

  @Column({ name: "sent_weight", type: "numeric", transformer: numericTransformer })
  sentWeight: number;

  @Column({ name: "sent_date", type: "date" })
  sentDate: string;

  @Column({ name: "vehicle_number", type: "text", nullable: true })
  vehicleNumber: string | null;

  @Column({ name: "driver_name", type: "text", nullable: true })
  driverName: string | null;

  @Column({
    name: "allowed_loss_percent",
    type: "numeric",
    default: 0,
    transformer: numericTransformer
  })
  allowedLossPercent: number;

  @Column({ name: "remarks", type: "text", nullable: true })
  remarks: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @OneToMany(() => InwardEntry, (inwardEntry) => inwardEntry.outwardEntry)
  inwardEntries: InwardEntry[];
}
