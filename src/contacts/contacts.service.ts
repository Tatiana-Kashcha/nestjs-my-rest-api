import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';

import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactResponseDto } from './dto/contact-response.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
  ) {}

  async create(
    createContactDto: CreateContactDto,
    userId: number,
  ): Promise<ContactResponseDto> {
    const newContact = this.contactsRepository.create({
      ...createContactDto,
      owner: userId,
    });
    const savedContact = await this.contactsRepository.save(newContact);
    console.log(savedContact);

    return {
      id: savedContact.id,
      name: savedContact.name,
      number: savedContact.number,
    };
  }

  async findAll(userId: number): Promise<ContactResponseDto[]> {
    const contacts = await this.contactsRepository.find({
      where: { owner: userId },
    });

    return contacts.map(({ id, name, number }) => ({
      id,
      name,
      number,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} contact`;
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return `This action updates a #${id} contact`;
  }

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }
}
