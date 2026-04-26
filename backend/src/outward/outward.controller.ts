import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { CreateOutwardDto } from "./dto/create-outward.dto";
import { OutwardService } from "./outward.service";

@Controller("outward")
export class OutwardController {
  constructor(private readonly outwardService: OutwardService) {}

  @Post()
  create(@Body() createOutwardDto: CreateOutwardDto) {
    return this.outwardService.create(createOutwardDto);
  }

  @Get()
  findAll() {
    return this.outwardService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.outwardService.findOne(id);
  }
}
