import { BadRequestException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface BrevoEmailResponse {
  messageId: string;
}

interface BrevoEmailError {
  message?: string;
  code?: string;
}

@Injectable()
export class BrevoEmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendShortageAlert(content: string): Promise<BrevoEmailResponse> {
    const apiKey = this.configService.get<string>("BREVO_API_KEY");
    const fromEmail = this.configService.get<string>("BREVO_FROM_EMAIL");
    const fromName = this.configService.get<string>("BREVO_FROM_NAME", "Fabric Tracker");
    const toEmail = this.configService.get<string>("ALERT_TO_EMAIL");
    const toName = this.configService.get<string>("ALERT_TO_NAME", "Factory Owner");

    if (!apiKey) {
      throw new BadRequestException("BREVO_API_KEY is missing in backend .env");
    }

    if (!fromEmail) {
      throw new BadRequestException("BREVO_FROM_EMAIL is missing in backend .env");
    }

    if (!toEmail) {
      throw new BadRequestException("ALERT_TO_EMAIL is missing in backend .env");
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          email: fromEmail,
          name: fromName
        },
        to: [
          {
            email: toEmail,
            name: toName
          }
        ],
        subject: "Fabric Shortage Alert",
        textContent: content,
        tags: ["fabric-shortage"]
      })
    });

    const responseBody = (await response.json().catch(() => null)) as
      | BrevoEmailResponse
      | BrevoEmailError
      | null;

    if (!response.ok) {
      const message =
        responseBody && "message" in responseBody && responseBody.message
          ? responseBody.message
          : "Brevo email request failed";
      throw new ServiceUnavailableException(message);
    }

    if (!responseBody || !("messageId" in responseBody)) {
      throw new ServiceUnavailableException("Brevo email response did not include a message ID");
    }

    return responseBody;
  }
}
