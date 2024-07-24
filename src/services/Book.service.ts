import { Book } from '../entity/Book.entity';
import { AppDataSource } from '../config/data-source';
import { Author } from '@src/entity/Author.entity';
import { Genre } from '@src/entity/Genre.entity';

const bookRepository = AppDataSource.getRepository(Book);

export class BookService {
  private bookRepository = AppDataSource.getRepository(Book);

  async getIndexDataBook() {
      return await this.bookRepository.count();
  }
}

export const getBooks = async () => {
  return bookRepository.find({
      order: { title: 'ASC' },
      relations: ['author', 'genres'],
  });
}

export const getBookById = async (bookId: number) => {
  return await bookRepository.findOne({ where: { id: bookId }, relations: ['author', 'genres', 'bookInstances'] });
};

export async function createBook(bookInput: any): Promise<Book> {
  const { title, author, summary, isbn, genres } = bookInput;

  let genreEntities: Genre[] = [];
  if (genres && Array.isArray(genres) && genres.length > 0) {
    genreEntities = await AppDataSource.getRepository(Genre).findByIds(genres);
  }

  const newBook = bookRepository.create({
    title,
    summary,
    isbn,
    author: author || undefined,
    genres: genreEntities.length > 0 ? genreEntities : undefined,
  });

  return await bookRepository.save(newBook);
}

export const updateBook = async (id: number, bookData: Partial<Book>, genreIds: number[]) => {
  const book = await getBookById(id);
  if (book) {
      let authorId: number | null | undefined = null;

      if (!isNaN(Number(bookData.author))) {
          authorId = Number(bookData.author);
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
