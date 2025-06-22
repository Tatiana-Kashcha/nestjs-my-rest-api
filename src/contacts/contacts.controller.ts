import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto, @Request() req) {
    const userId = req.user.id;

    return await this.contactsService.create(createContactDto, userId);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    return await this.contactsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactsService.update(+id, updateContactDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ id: number }> {
    const numericId = +id;
    await this.contactsService.remove(numericId);

    return { id: numericId };
  }
}
