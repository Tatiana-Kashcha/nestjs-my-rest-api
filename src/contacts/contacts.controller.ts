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
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactResponseDto } from './dto/contact-response.dto';
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
  async findOne(@Param('id') id: string): Promise<ContactResponseDto | null> {
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
      throw new BadRequestException('ID must be a valid number');
    }

    const contact = await this.contactsService.findOne(parsedId);

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${parsedId} not found`);
    }

    return contact;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<ContactResponseDto | null> {
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
      throw new BadRequestException('ID must be a valid number');
    }

    const contactUpdated = await this.contactsService.update(
      parsedId,
      updateContactDto,
    );

    if (!contactUpdated) {
      throw new NotFoundException(`Contact with ID ${parsedId} not found`);
    }

    return contactUpdated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ id: number }> {
    const numericId = +id;
    await this.contactsService.remove(numericId);

    return { id: numericId };
  }
}
