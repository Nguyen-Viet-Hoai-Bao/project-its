import { AppDataSource } from '../config/data-source';
import { Book } from '../entity/Book.entity';
import { Author } from '../entity/Author.entity';
import { Genre } from '../entity/Genre.entity';

const bookRepository = AppDataSource.getRepository(Book);

export const findAllBooks = async () => {
    return await bookRepository.find({ relations: ['author', 'genres'] });
};

export const findBookById = async (id: number) => {
    return await bookRepository.findOne({ where: { id }, relations: ['author', 'genres'] });
};

export const findBookByAuthorId = async (authorId: number) => {
    return await bookRepository.find({ where: { authorId }, relations: ['author', 'genres'] });
};

export const createBook = async (bookData: Partial<Book>, authorId: number, genreIds: number[]) => {
    const author = authorId ? await AppDataSource.getRepository(Author).findOne({ where: { id: authorId } }) : null;
    const genres = genreIds.length ? await AppDataSource.getRepository(Genre).findByIds(genreIds) : [];

    const newBook = bookRepository.create({
        ...bookData,
        author: author || undefined,
        genres: genres.length > 0 ? genres : undefined,
    });

    return await bookRepository.save(newBook);
};

export const deleteBook = async (id: number) => {
    const book = await findBookById(id);
    if (book) {
        await bookRepository.remove(book);
        return true;
    }
    return false;
};

export const updateBook = async (id: number, bookData: Partial<Book>, genreIds: number[]) => {
    const book = await findBookById(id);
    if (book) {
        let authorId: number | null | undefined = null;

        if (typeof bookData.author === 'number') {
            authorId = bookData.author;
        } else if (bookData.author instanceof Author) {
            authorId = bookData.author.id;
        } else {
            authorId = book.author?.id;
        }

        const author = authorId ? await AppDataSource.getRepository(Author).findOne({ where: { id: authorId } }) : null;
        const genres = await AppDataSource.getRepository(Genre).findByIds(genreIds);

        Object.assign(book, bookData, { author, genres });

        return await bookRepository.save(book);
    }
    return null;
};
