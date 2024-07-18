import { AppDataSource } from '../config/data-source';
import { BookInstance } from '../entity/BookInstance.entity';
import { Book } from '../entity/Book.entity';

const bookInstanceRepository = AppDataSource.getRepository(BookInstance);

export const findAllBookInstances = async () => {
    return await bookInstanceRepository.find({ relations: ['book'] });
};

export const findBookInstanceById = async (id: number) => {
    return await bookInstanceRepository.findOne({ where: { id } });
};

export const createBookInstance = async (bookInstanceData: Partial<BookInstance>, bookId: number) => {
    const book = await AppDataSource.getRepository(Book).findOne({ where: { id: bookId } });
    if (!book) throw new Error('Book not found');

    const newBookInstance = bookInstanceRepository.create({
        ...bookInstanceData,
        book,
    });

    return await bookInstanceRepository.save(newBookInstance);
};

export const deleteBookInstance = async (id: number) => {
    const bookInstance = await findBookInstanceById(id);
    if (bookInstance) {
        await bookInstanceRepository.remove(bookInstance);
        return true;
    }
    return false;
};

export const updateBookInstance = async (id: number, bookInstanceData: Partial<BookInstance>, bookId: number) => {
    const bookInstance = await findBookInstanceById(id);
    if (bookInstance) {
        const book = await AppDataSource.getRepository(Book).findOne({ where: { id: bookId } });
        if (!book) throw new Error('Book not found');

        Object.assign(bookInstance, bookInstanceData, { book });

        return await bookInstanceRepository.save(bookInstance);
    }
    return null;
};
