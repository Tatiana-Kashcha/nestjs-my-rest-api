import { Injectable, NotFoundException } from '@nestjs/common';
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

  // Метод .delete(id) виконує DELETE і не перевіряє, чи існує об'єкт у базі даних.

  // async remove(id: number): Promise<{ id: number }> {
  //   await this.contactsRepository.delete(id);

  //   return { id };
  // }

  // Замінимо на варіант з додаванням перевірки існування об'єкта у базі даних

  async remove(id: number): Promise<{ id: number }> {
    const contact = await this.contactsRepository.findOneBy({ id });

    if (!contact) {
      throw new NotFoundException(`Contact with id ${id} not found`);
    }

    await this.contactsRepository.delete(id);

    return { id };
  }
}
