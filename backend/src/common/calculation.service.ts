import { Injectable } from "@nestjs/common";

@Injectable()
export class CalculationService {
  calculateExpectedReceivedWeight(sentWeight: number, allowedLossPercent: number): number {
    return this.round(sentWeight - (sentWeight * allowedLossPercent) / 100);
  }

  calculateShortage(expectedReceivedWeight: number, receivedWeight: number): number {
    return this.round(expectedReceivedWeight - receivedWeight);
  }

  getStatus(shortage: number): "NORMAL" | "SHORTAGE_ALERT" {
    return shortage > 0 ? "SHORTAGE_ALERT" : "NORMAL";
  }

  private round(value: number): number {
    return Number(value.toFixed(3));
  }
}
