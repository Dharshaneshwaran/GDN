import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { CreateInwardDto } from "./dto/create-inward.dto";
import { InwardService } from "./inward.service";

@Controller("inward")
export class InwardController {
  constructor(private readonly inwardService: InwardService) {}

  @Post()
  create(@Body() createInwardDto: CreateInwardDto) {
    return this.inwardService.create(createInwardDto);
  }

  @Get()
  findAll() {
    return this.inwardService.findAll();
  }

  @Post(":id/send-email-alert")
  sendEmailAlert(@Param("id", ParseUUIDPipe) id: string) {
    return this.inwardService.sendEmailAlert(id);
  }
}
