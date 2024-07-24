import { BookInstance } from '../entity/BookInstance.entity';
import { AppDataSource } from '../config/data-source';
import { BookInstanceStatus } from '@src/enums/BookInstanceStatus';

const bookInstanceRepository = AppDataSource.getRepository(BookInstance);

export class BookInstanceService {
  private bookInstanceRepository = AppDataSource.getRepository(BookInstance)
  async getIndexDataBookInstances() {
    return this.bookInstanceRepository.count()
  }
  async getIndexDataAvailableBookInstances() {
    return this.bookInstanceRepository.count({ where: { status: BookInstanceStatus.Available } })
  }
}

export const getBookInstances = async () => {
  return bookInstanceRepository.find({
      relations: ['book'],
  });
};

export const getBookInstanceById = async (instanceId: number) => {
  return await bookInstanceRepository.findOne({ where: { id: instanceId }, relations: ['book'] });
};

export async function createBookInstance(bookInstanceInput: any): Promise<BookInstance> {
  const { book, imprint, due_back, status } = bookInstanceInput;

  const newBookInstance = new BookInstance();
  newBookInstance.book = book;
  newBookInstance.imprint = imprint;
  newBookInstance.due_back = due_back;
  newBookInstance.status = status;

  return await bookInstanceRepository.save(newBookInstance);
};