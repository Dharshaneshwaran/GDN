import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { numericTransformer } from "../common/numeric.transformer";
import { OutwardEntry } from "../outward/outward-entry.entity";

@Entity({ name: "inward_entries" })
export class InwardEntry {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => OutwardEntry, (outwardEntry) => outwardEntry.inwardEntries, {
    eager: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "outward_entry_id" })
  outwardEntry: OutwardEntry;

  @Column({ name: "received_weight", type: "numeric", transformer: numericTransformer })
  receivedWeight: number;

  @Column({ name: "received_date", type: "date" })
  receivedDate: string;

  @Column({ name: "received_by", type: "text", nullable: true })
  receivedBy: string | null;

  @Column({ name: "remarks", type: "text", nullable: true })
  remarks: string | null;

  @Column({
    name: "expected_received_weight",
    type: "numeric",
    nullable: true,
    transformer: numericTransformer
  })
  expectedReceivedWeight: number | null;

  @Column({ name: "shortage", type: "numeric", nullable: true, transformer: numericTransformer })
  shortage: number | null;

  @Column({ name: "status", type: "text", nullable: true })
  status: string | null;

  @Column({ name: "whatsapp_alert_message", type: "text", nullable: true })
  whatsappAlertMessage: string | null;

  @Column({ name: "whatsapp_alert_url", type: "text", nullable: true })
  whatsappAlertUrl: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;
}
