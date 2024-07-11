import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { AppDataSource } from '../config/data-source';
import { Book } from '@src/entity/Book.entity';
import { Author } from '@src/entity/Author.entity';
import { Genre } from '@src/entity/Genre.entity';
import { BookInstance } from '@src/entity/BookInstance.entity';

const index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bookRepository = AppDataSource.getRepository(Book);
    const authorRepository = AppDataSource.getRepository(Author);
    const genreRepository = AppDataSource.getRepository(Genre);
    const bookInstanceRepository = AppDataSource.getRepository(BookInstance);
    
    const [numBooks, numBookInstances, availableBookInstances, numAuthors, numGenres] = await Promise.all([
        bookRepository.count(),
        bookInstanceRepository.count(),
        bookInstanceRepository.findAndCount({
            where: { status: 'Available' }
        }),
        authorRepository.count(),
        genreRepository.count()
    ]);

    res.render('index', {
        title: 'Local library home',
        welcome_message: 'Welcome to the Library!',
        content_title: 'Content',
        record_infor_message: 'Here is some information about our records:',
        book_label: 'Books',
        book_instance_label: 'Book Instances',
        available_book_instance_label: 'Available Book Instances',
        author_label: 'Authors',
        genre_label: 'Genres',
        book_count: numBooks,
        book_instance_count: numBookInstances,
        book_instance_available_count: availableBookInstances[1],
        author_count: numAuthors,
        genre_count: numGenres
    });
    console.error('render data:', ' --- ', numBooks, ' --- ', numBookInstances, ' --- ',
        availableBookInstances[1], ' --- ', numAuthors, ' --- ', numGenres);

});

const bookList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Get Books");
    const bookRepository = AppDataSource.getRepository(Book);
    const books = await bookRepository.find();
    res.json(books);
});

export { index, bookList };